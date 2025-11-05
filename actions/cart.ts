/**
 * @file actions/cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * Supabase에서 장바구니 데이터를 조회하고 수정하는 Server Actions입니다.
 * Service Role 클라이언트를 사용하여 RLS를 우회합니다.
 */

"use server";

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type { CartItem, CartItemWithProduct, AddToCartItem, CartSummary } from "@/types/cart";
import type { Product } from "@/types/product";

/**
 * 장바구니 아이템 조회 (상품 정보 포함)
 * @param clerkId - Clerk 사용자 ID
 * @returns 장바구니 아이템 목록 (상품 정보 포함)
 */
export async function getCartItems(clerkId: string): Promise<CartItemWithProduct[]> {
  try {
    const supabase = getServiceRoleClient();

    // cart_items와 products JOIN
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("장바구니 조회 오류:", error);
      throw new Error(`장바구니 조회 실패: ${error.message}`);
    }

    // 타입 변환
    const cartItems: CartItemWithProduct[] = (data || []).map((item: any) => ({
      id: item.id,
      clerk_id: item.clerk_id,
      product_id: item.product_id,
      quantity: item.quantity,
      color: item.color || null,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: item.product as Product,
    }));

    return cartItems;
  } catch (error) {
    console.error("getCartItems 오류:", error);
    throw error instanceof Error
      ? error
      : new Error("장바구니 조회 중 예상치 못한 오류가 발생했습니다.");
  }
}

/**
 * 장바구니 아이템 개수 조회 (Navbar 배지용)
 * @param clerkId - Clerk 사용자 ID
 * @returns 장바구니 아이템 개수
 */
export async function getCartItemCount(clerkId: string): Promise<number> {
  try {
    const supabase = getServiceRoleClient();

    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("장바구니 개수 조회 오류:", error);
      // 에러가 발생해도 0을 반환 (UI 깨짐 방지)
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("getCartItemCount 오류:", error);
    return 0;
  }
}

/**
 * 장바구니에 아이템 추가
 * @param clerkId - Clerk 사용자 ID
 * @param items - 추가할 아이템 목록
 * @returns 추가된 아이템 개수
 */
export async function addToCart(
  clerkId: string,
  items: AddToCartItem[]
): Promise<{ success: boolean; addedCount: number; errors?: string[] }> {
  try {
    const supabase = getServiceRoleClient();
    const errors: string[] = [];
    let addedCount = 0;

    // 각 아이템을 순차적으로 추가
    for (const item of items) {
      try {
        // 상품 정보 조회 (재고 확인)
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("stock_quantity, is_active")
          .eq("id", item.productId)
          .single();

        if (productError || !product) {
          errors.push(`상품 ID ${item.productId}: 상품을 찾을 수 없습니다.`);
          continue;
        }

        if (!product.is_active) {
          errors.push(`상품 ID ${item.productId}: 비활성화된 상품입니다.`);
          continue;
        }

        if (product.stock_quantity < item.quantity) {
          errors.push(
            `상품 ID ${item.productId}: 재고가 부족합니다. (재고: ${product.stock_quantity}개, 요청: ${item.quantity}개)`
          );
          continue;
        }

        // 기존 장바구니 아이템 확인 (같은 상품, 같은 색상)
        const { data: existingItem } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("clerk_id", clerkId)
          .eq("product_id", item.productId)
          .eq("color", item.color || null)
          .single();

        if (existingItem) {
          // 기존 아이템이 있으면 수량 업데이트
          const newQuantity = existingItem.quantity + item.quantity;

          // 재고 확인
          if (newQuantity > product.stock_quantity) {
            errors.push(
              `상품 ID ${item.productId}: 수량을 초과했습니다. (재고: ${product.stock_quantity}개)`
            );
            continue;
          }

          const { error: updateError } = await supabase
            .from("cart_items")
            .update({ quantity: newQuantity })
            .eq("id", existingItem.id);

          if (updateError) {
            errors.push(`상품 ID ${item.productId}: 수량 업데이트 실패`);
            continue;
          }

          addedCount++;
        } else {
          // 새 아이템 추가
          const { error: insertError } = await supabase.from("cart_items").insert({
            clerk_id: clerkId,
            product_id: item.productId,
            quantity: item.quantity,
            color: item.color || null,
          });

          if (insertError) {
            errors.push(`상품 ID ${item.productId}: 장바구니 추가 실패`);
            continue;
          }

          addedCount++;
        }
      } catch (itemError) {
        console.error(`아이템 추가 오류 (productId: ${item.productId}):`, itemError);
        errors.push(`상품 ID ${item.productId}: 처리 중 오류 발생`);
      }
    }

    return {
      success: addedCount > 0,
      addedCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error("addToCart 오류:", error);
    throw error instanceof Error
      ? error
      : new Error("장바구니 추가 중 예상치 못한 오류가 발생했습니다.");
  }
}

/**
 * 장바구니 아이템 수량 변경
 * @param cartItemId - 장바구니 아이템 ID
 * @param quantity - 새로운 수량
 * @returns 성공 여부
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    if (quantity <= 0) {
      return { success: false, error: "수량은 1개 이상이어야 합니다." };
    }

    const supabase = getServiceRoleClient();

    // 장바구니 아이템 조회 (상품 정보 포함)
    const { data: cartItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("id", cartItemId)
      .single();

    if (fetchError || !cartItem) {
      return { success: false, error: "장바구니 아이템을 찾을 수 없습니다." };
    }

    // 상품 재고 확인
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", cartItem.product_id)
      .single();

    if (productError || !product) {
      return { success: false, error: "상품 정보를 찾을 수 없습니다." };
    }

    if (quantity > product.stock_quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (재고: ${product.stock_quantity}개)`,
      };
    }

    // 수량 업데이트
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId);

    if (updateError) {
      console.error("수량 업데이트 오류:", updateError);
      return { success: false, error: "수량 변경 실패" };
    }

    return { success: true };
  } catch (error) {
    console.error("updateCartItemQuantity 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "수량 변경 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 삭제
 * @param cartItemId - 장바구니 아이템 ID
 * @returns 성공 여부
 */
export async function removeCartItem(cartItemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getServiceRoleClient();

    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);

    if (error) {
      console.error("장바구니 아이템 삭제 오류:", error);
      return { success: false, error: "장바구니 아이템 삭제 실패" };
    }

    return { success: true };
  } catch (error) {
    console.error("removeCartItem 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "장바구니 아이템 삭제 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 전체 비우기
 * @param clerkId - Clerk 사용자 ID
 * @returns 성공 여부
 */
export async function clearCart(clerkId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getServiceRoleClient();

    const { error } = await supabase.from("cart_items").delete().eq("clerk_id", clerkId);

    if (error) {
      console.error("장바구니 비우기 오류:", error);
      return { success: false, error: "장바구니 비우기 실패" };
    }

    return { success: true };
  } catch (error) {
    console.error("clearCart 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "장바구니 비우기 중 오류가 발생했습니다.",
    };
  }
}


