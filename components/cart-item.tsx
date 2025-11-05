/**
 * @file components/cart-item.tsx
 * @description 장바구니 아이템 컴포넌트
 *
 * 장바구니에 담긴 개별 아이템을 표시하고, 수량 변경 및 삭제 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 상품 정보 표시 (이미지, 이름, 가격, 색상)
 * 2. 수량 조절 UI (+/- 버튼)
 * 3. 개별 아이템 총액 표시
 * 4. 삭제 버튼
 *
 * @dependencies
 * - react: useState 훅 사용
 * - next/image: Image 컴포넌트
 * - next/link: Link 컴포넌트
 * - lucide-react: Plus, Minus, Trash2 아이콘
 * - @/components/ui/button: Button 컴포넌트
 * - @/actions/cart: updateCartItemQuantity, removeCartItem
 * - @/types/cart: CartItemWithProduct
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCartItemQuantity, removeCartItem } from "@/actions/cart";
import type { CartItemWithProduct } from "@/types/cart";

interface CartItemProps {
  /** 장바구니 아이템 (상품 정보 포함) */
  item: CartItemWithProduct;
  /** 수량 변경 후 콜백 (장바구니 목록 새로고침용) */
  onUpdate?: () => void;
  /** 삭제 후 콜백 (장바구니 목록 새로고침용) */
  onRemove?: () => void;
}

/**
 * 장바구니 아이템 컴포넌트
 */
export function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // 개별 아이템 총액 계산
  const itemTotal = item.product.price * quantity;

  // 가격 포맷팅
  const formattedPrice = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(item.product.price);

  const formattedTotal = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(itemTotal);

  /**
   * 수량 증가
   */
  const handleIncrease = async () => {
    if (isUpdating || quantity >= item.product.stock_quantity) return;

    setIsUpdating(true);
    const newQuantity = quantity + 1;

    const result = await updateCartItemQuantity(item.id, newQuantity);

    if (result.success) {
      setQuantity(newQuantity);
      onUpdate?.();
    } else {
      // 에러 발생 시 원래 수량으로 복구
      alert(result.error || "수량 변경에 실패했습니다.");
    }

    setIsUpdating(false);
  };

  /**
   * 수량 감소
   */
  const handleDecrease = async () => {
    if (isUpdating || quantity <= 1) return;

    setIsUpdating(true);
    const newQuantity = quantity - 1;

    const result = await updateCartItemQuantity(item.id, newQuantity);

    if (result.success) {
      setQuantity(newQuantity);
      onUpdate?.();
    } else {
      alert(result.error || "수량 변경에 실패했습니다.");
    }

    setIsUpdating(false);
  };

  /**
   * 아이템 삭제
   */
  const handleRemove = async () => {
    if (isRemoving) return;

    if (!confirm("장바구니에서 이 상품을 삭제하시겠습니까?")) {
      return;
    }

    setIsRemoving(true);

    const result = await removeCartItem(item.id);

    if (result.success) {
      onRemove?.();
    } else {
      alert(result.error || "삭제에 실패했습니다.");
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* 상품 이미지 */}
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="relative w-full sm:w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
          {item.product.category ? (
            <Image
              src={`https://placehold.co/200x200/3b82f6/ffffff?text=${encodeURIComponent(item.product.category)}`}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="96px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-2xl font-medium">
                {item.product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* 상품 정보 및 액션 */}
      <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
        {/* 상품 정보 */}
        <div className="flex-1">
          <Link href={`/products/${item.product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400">
              {item.product.name}
            </h3>
          </Link>

          {/* 색상 정보 (있는 경우) */}
          {item.color && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              색상: {item.color}
            </p>
          )}

          {/* 단가 */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            단가: {formattedPrice}
          </p>

          {/* 재고 부족 알림 */}
          {quantity >= item.product.stock_quantity && (
            <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
              재고 부족 (최대 {item.product.stock_quantity}개)
            </p>
          )}
        </div>

        {/* 수량 조절 및 삭제 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* 수량 조절 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrease}
              disabled={isUpdating || quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
              {quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrease}
              disabled={isUpdating || quantity >= item.product.stock_quantity}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* 소계 */}
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formattedTotal}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {quantity}개 × {formattedPrice}
            </p>
          </div>

          {/* 삭제 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-8 w-8 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

