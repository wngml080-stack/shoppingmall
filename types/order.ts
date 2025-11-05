/**
 * @file types/order.ts
 * @description 주문 관련 TypeScript 타입 정의
 *
 * Supabase orders 및 order_items 테이블의 스키마를 기반으로 한 타입 정의입니다.
 */

import type { Product } from "./product";

/**
 * 배송지 정보
 */
export interface ShippingAddress {
  name: string;
  phone: string;
  postcode: string;
  address: string;
  detailAddress?: string;
}

/**
 * 주문 (orders 테이블과 매핑)
 */
export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shipping_address: ShippingAddress | null;
  order_note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 주문 아이템 (order_items 테이블과 매핑)
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * 주문 아이템 + 상품 정보 (JOIN 결과)
 */
export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}

/**
 * 주문 + 주문 아이템 (JOIN 결과)
 */
export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/**
 * 주문 + 주문 아이템 + 상품 정보 (JOIN 결과)
 */
export interface OrderWithItemsAndProducts extends Order {
  order_items: OrderItemWithProduct[];
}

/**
 * 주문 생성용 데이터
 */
export interface CreateOrderData {
  shippingAddress: ShippingAddress;
  orderNote?: string;
}

