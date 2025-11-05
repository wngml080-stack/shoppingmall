/**
 * @file app/cart/cart-content-client.tsx
 * @description 장바구니 내용 클라이언트 컴포넌트
 *
 * 장바구니 아이템 목록을 표시하고, 수량 변경 및 삭제 기능을 제공하는 Client Component입니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이템 목록 표시
 * 2. 수량 변경 시 즉시 총액 업데이트
 * 3. 아이템 삭제 시 목록 업데이트
 * 4. 총액 계산 및 표시
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartItem } from "@/components/cart-item";
import { Button } from "@/components/ui/button";
import { calculateCartSummary } from "@/lib/cart-utils";
import type { CartItemWithProduct } from "@/types/cart";
import type { CartSummary } from "@/types/cart";

interface CartContentClientProps {
  cartItems: CartItemWithProduct[];
  formattedTotal: string;
  summary: CartSummary;
}

export function CartContentClient({
  cartItems: initialItems,
  formattedTotal: initialTotal,
  summary: initialSummary,
}: CartContentClientProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialItems);
  const [summary, setSummary] = useState(initialSummary);
  const [formattedTotal, setFormattedTotal] = useState(initialTotal);

  // 장바구니 업데이트 시 목록 새로고침
  const handleRefresh = () => {
    router.refresh();
  };

  // 아이템 수정/삭제 후 목록 업데이트
  useEffect(() => {
    // 총액 재계산
    const newSummary = calculateCartSummary(cartItems);
    setSummary(newSummary);

    const newFormattedTotal = new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(newSummary.totalAmount);
    setFormattedTotal(newFormattedTotal);
  }, [cartItems]);

  // 아이템 삭제 처리
  const handleItemRemove = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      {/* 장바구니 아이템 목록 */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdate={handleRefresh}
            onRemove={() => handleItemRemove(item.id)}
          />
        ))}
      </div>

      {/* 총액 및 주문하기 버튼 */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              총 {summary.totalItems}개 아이템
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formattedTotal}
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/products" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto">
                쇼핑 계속하기
              </Button>
            </Link>
            <Link href="/checkout" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full sm:w-auto">
                주문하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

