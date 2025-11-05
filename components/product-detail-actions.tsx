/**
 * @file components/product-detail-actions.tsx
 * @description 상품 상세 페이지 액션 컴포넌트
 *
 * 상품 상세 페이지에서 ProductSelector와 장바구니 담기 버튼을 통합하는 Client Component입니다.
 *
 * 주요 기능:
 * 1. ProductSelector의 선택한 항목 관리
 * 2. 장바구니 담기 기능
 * 3. Dialog 표시
 *
 * @dependencies
 * - react: useState 훅 사용
 * - @/components/product-selector: ProductSelector
 * - @/components/add-to-cart-button: AddToCartButton
 * - @/types/product-selector: SelectedItem
 */

"use client";

import { useState } from "react";
import { ProductSelector } from "@/components/product-selector";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { SelectedItem } from "@/types/product-selector";

interface ProductDetailActionsProps {
  /** 상품 ID */
  productId: string;
  /** 재고 수량 */
  stockQuantity: number;
}

/**
 * 상품 상세 페이지 액션 컴포넌트
 */
export function ProductDetailActions({
  productId,
  stockQuantity,
}: ProductDetailActionsProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  return (
    <>
      {/* 옵션 선택 (색상/수량) */}
      <div className="mb-6">
        <ProductSelector
          stockQuantity={stockQuantity}
          onItemsChange={setSelectedItems}
        />
      </div>

      {/* 장바구니 추가 버튼 */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <AddToCartButton
          productId={productId}
          stockQuantity={stockQuantity}
          selectedItems={selectedItems}
        />
      </div>
    </>
  );
}

