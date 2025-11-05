/**
 * @file lib/cart-utils.ts
 * @description 장바구니 관련 유틸리티 함수
 *
 * 순수 계산 함수들로, Server Action이 아닌 일반 함수입니다.
 */

import type { CartItemWithProduct, CartSummary } from "@/types/cart";

/**
 * 장바구니 총액 계산
 * @param cartItems - 장바구니 아이템 목록 (상품 정보 포함)
 * @returns 총액 정보
 */
export function calculateCartSummary(cartItems: CartItemWithProduct[]): CartSummary {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    totalItems,
    totalAmount,
  };
}

