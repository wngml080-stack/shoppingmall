/**
 * @file types/cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 *
 * Supabase cart_items 테이블의 스키마를 기반으로 한 타입 정의입니다.
 */

import type { Product } from "./product";

/**
 * 장바구니 아이템 (cart_items 테이블과 매핑)
 */
export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  color?: string | null; // 색상 정보 (선택사항, 향후 확장용)
  created_at: string;
  updated_at: string;
}

/**
 * 장바구니 아이템 + 상품 정보 (JOIN 결과)
 */
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

/**
 * 장바구니에 추가할 아이템 정보
 */
export interface AddToCartItem {
  productId: string;
  quantity: number;
  color?: string;
}

/**
 * 장바구니 총액 정보
 */
export interface CartSummary {
  /** 총 아이템 개수 */
  totalItems: number;
  /** 총 금액 */
  totalAmount: number;
}

