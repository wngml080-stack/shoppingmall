/**
 * @file actions/orders.ts
 * @description 주문 관련 Server Actions
 *
 * Supabase에서 주문 데이터를 생성하고 조회하는 Server Actions입니다.
 * Service Role 클라이언트를 사용하여 RLS를 우회합니다.
 */

"use server";

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { getCartItems } from "@/actions/cart";
import { clearCart } from "@/actions/cart";
import { calculateCartSummary } from "@/lib/cart-utils";
import type {
  Order,
  OrderItem,
  OrderWithItems,
  OrderItemWithProduct,
  OrderWithItemsAndProducts,
  CreateOrderData,
  ShippingAddress,
} from "@/types/order";
import type { CartItemWithProduct } from "@/types/cart";

/**
 * 주문 생성
 * @param clerkId - Clerk 사용자 ID
 * @param orderData - 주문 데이터 (배송지 정보, 주문 요청사항)
 * @returns 생성된 주문 ID
 */
export async function createOrder(
  clerkId: string,
  orderData: CreateOrderData
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const supabase = getServiceRoleClient();

    console.group("주문 생성 시작");
    console.log("Clerk ID:", clerkId);
    console.log("주문 데이터:", orderData);

    // 1. 장바구니 아이템 조회
    const cartItems = await getCartItems(clerkId);

    console.log("장바구니 아이템 개수:", cartItems.length);

    // 2. 장바구니가 비어있는지 확인
    if (cartItems.length === 0) {
      console.error("장바구니가 비어있습니다.");
      return { success: false, error: "장바구니가 비어있습니다." };
    }

    // 3. 재고 확인 및 주문 총액 계산
    const totalAmount = calculateCartSummary(cartItems).totalAmount;

    // 각 아이템의 재고 확인
    for (const item of cartItems) {
      if (!item.product.is_active) {
        return {
          success: false,
          error: `"${item.product.name}" 상품이 현재 판매 중지되었습니다.`,
        };
      }

      if (item.product.stock_quantity < item.quantity) {
        return {
          success: false,
          error: `"${item.product.name}" 상품의 재고가 부족합니다. (재고: ${item.product.stock_quantity}개, 요청: ${item.quantity}개)`,
        };
      }
    }

    console.log("주문 총액:", totalAmount);

    // 4. 주문 생성 (orders 테이블)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        clerk_id: clerkId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: orderData.shippingAddress as any,
        order_note: orderData.orderNote || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("주문 생성 오류:", orderError);
      return {
        success: false,
        error: `주문 생성 실패: ${orderError?.message || "알 수 없는 오류"}`,
      };
    }

    console.log("주문 생성 완료, 주문 ID:", order.id);

    // 5. 주문 아이템 생성 (order_items 테이블)
    const orderItemsData: Omit<OrderItem, "id" | "created_at">[] = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (orderItemsError) {
      console.error("주문 아이템 생성 오류:", orderItemsError);
      // 주문 아이템 생성 실패 시 주문 삭제 (롤백)
      await supabase.from("orders").delete().eq("id", order.id);
      return {
        success: false,
        error: `주문 아이템 생성 실패: ${orderItemsError.message}`,
      };
    }

    console.log("주문 아이템 생성 완료");

    // 6. 장바구니 비우기
    const clearResult = await clearCart(clerkId);
    if (!clearResult.success) {
      console.error("장바구니 비우기 실패:", clearResult.error);
      // 장바구니 비우기 실패해도 주문은 이미 생성되었으므로 경고만 로그
      console.warn("주문은 생성되었지만 장바구니 비우기에 실패했습니다.");
    } else {
      console.log("장바구니 비우기 완료");
    }

    console.groupEnd();

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("createOrder 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "주문 생성 중 예상치 못한 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 내역 조회
 * @param clerkId - Clerk 사용자 ID
 * @returns 주문 목록 (최신순)
 */
export async function getOrders(clerkId: string): Promise<Order[]> {
  try {
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("주문 내역 조회 오류:", error);
      throw new Error(`주문 내역 조회 실패: ${error.message}`);
    }

    return (data || []) as Order[];
  } catch (error) {
    console.error("getOrders 오류:", error);
    throw error instanceof Error
      ? error
      : new Error("주문 내역 조회 중 예상치 못한 오류가 발생했습니다.");
  }
}

/**
 * 주문 상세 조회
 * @param orderId - 주문 ID
 * @param clerkId - Clerk 사용자 ID (본인 주문만 조회 가능하도록)
 * @returns 주문 정보 + 주문 아이템 목록 + 상품 정보
 */
export async function getOrderById(
  orderId: string,
  clerkId: string
): Promise<OrderWithItemsAndProducts | null> {
  try {
    const supabase = getServiceRoleClient();

    // 1. 주문 조회 (clerk_id로 검증)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError || !order) {
      console.error("주문 조회 오류:", orderError);
      return null;
    }

    // 2. 주문 아이템 조회 (상품 정보 포함)
    const { data: orderItems, error: orderItemsError } = await supabase
      .from("order_items")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (orderItemsError) {
      console.error("주문 아이템 조회 오류:", orderItemsError);
      throw new Error(`주문 아이템 조회 실패: ${orderItemsError.message}`);
    }

    // 타입 변환
    const orderItemsWithProducts: OrderItemWithProduct[] = (orderItems || []).map((item: any) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      created_at: item.created_at,
      product: item.product,
    }));

    return {
      ...(order as Order),
      order_items: orderItemsWithProducts,
    };
  } catch (error) {
    console.error("getOrderById 오류:", error);
    throw error instanceof Error
      ? error
      : new Error("주문 상세 조회 중 예상치 못한 오류가 발생했습니다.");
  }
}

