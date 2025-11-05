/**
 * @file components/add-to-cart-dialog.tsx
 * @description 장바구니 담기 성공 Dialog
 *
 * 장바구니에 상품을 추가한 후 표시되는 Dialog입니다.
 * 사용자가 장바구니로 이동할지, 현재 페이지에 머무를지 선택할 수 있습니다.
 *
 * 주요 기능:
 * 1. 장바구니 담기 성공 메시지 표시
 * 2. 추가된 아이템 요약 표시
 * 3. "장바구니로 이동" 버튼
 * 4. "계속 쇼핑" 버튼
 *
 * @dependencies
 * - react: useState 훅 사용
 * - next/navigation: useRouter
 * - @/components/ui/dialog: Dialog 컴포넌트
 * - @/components/ui/button: Button 컴포넌트
 */

"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AddToCartItem } from "@/types/cart";

interface AddToCartDialogProps {
  /** Dialog 열림 상태 */
  open: boolean;
  /** Dialog 닫기 핸들러 */
  onOpenChange: (open: boolean) => void;
  /** 추가된 아이템 목록 */
  items: AddToCartItem[];
  /** 추가된 총 아이템 개수 */
  totalItems: number;
}

/**
 * 장바구니 담기 성공 Dialog 컴포넌트
 */
export function AddToCartDialog({
  open,
  onOpenChange,
  items,
  totalItems,
}: AddToCartDialogProps) {
  const router = useRouter();

  /**
   * 장바구니로 이동
   */
  const handleGoToCart = () => {
    onOpenChange(false);
    router.push("/cart");
  };

  /**
   * 계속 쇼핑 (Dialog 닫기)
   */
  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>장바구니에 추가되었습니다!</DialogTitle>
          <DialogDescription>
            {totalItems}개의 상품이 장바구니에 추가되었습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 추가된 아이템 요약 */}
        {items.length > 0 && (
          <div className="py-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.color ? `${item.color} ${item.quantity}개` : `${item.quantity}개`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleContinueShopping}
            className="w-full sm:w-auto"
          >
            계속 쇼핑
          </Button>
          <Button onClick={handleGoToCart} className="w-full sm:w-auto">
            장바구니로 이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

