/**
 * @file components/add-to-cart-button.tsx
 * @description 장바구니 담기 버튼 컴포넌트
 *
 * 상품 상세 페이지에서 사용되는 장바구니 담기 버튼입니다.
 * ProductSelector에서 선택한 항목들을 장바구니에 추가합니다.
 *
 * 주요 기능:
 * 1. 선택한 항목들을 장바구니에 추가
 * 2. 성공 시 Dialog 표시
 * 3. 로그인 체크
 *
 * @dependencies
 * - react: useState 훅 사용
 * - @clerk/nextjs: useAuth, useUser
 * - @/components/ui/button: Button 컴포넌트
 * - @/components/add-to-cart-dialog: AddToCartDialog
 * - @/actions/cart: addToCart
 * - @/types/product-selector: SelectedItem
 */

"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AddToCartDialog } from "@/components/add-to-cart-dialog";
import { addToCart } from "@/actions/cart";
import type { SelectedItem } from "@/types/product-selector";
import type { AddToCartItem } from "@/types/cart";

interface AddToCartButtonProps {
  /** 상품 ID */
  productId: string;
  /** 재고 수량 */
  stockQuantity: number;
  /** 선택한 항목 목록 */
  selectedItems: SelectedItem[];
}

/**
 * 장바구니 담기 버튼 컴포넌트
 */
export function AddToCartButton({
  productId,
  stockQuantity,
  selectedItems,
}: AddToCartButtonProps) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<AddToCartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  /**
   * 장바구니에 추가
   */
  const handleAddToCart = async () => {
    // 로그인 체크
    if (!isSignedIn || !user) {
      router.push("/sign-in");
      return;
    }

    // 선택한 항목 체크
    if (selectedItems.length === 0) {
      alert("색상과 수량을 선택해주세요.");
      return;
    }

    setIsAdding(true);

    try {
      // 선택한 항목들을 AddToCartItem 형태로 변환
      const itemsToAdd: AddToCartItem[] = selectedItems.map((item) => ({
        productId,
        quantity: item.quantity,
        color: item.color,
      }));

      // 장바구니에 추가
      const result = await addToCart(user.id, itemsToAdd);

      if (result.success) {
        // 성공 시 Dialog 표시
        setAddedItems(itemsToAdd);
        setTotalItems(result.addedCount);
        setDialogOpen(true);
      } else {
        // 에러 처리
        const errorMessage = result.errors
          ? result.errors.join("\n")
          : "장바구니 추가에 실패했습니다.";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full"
        disabled={stockQuantity === 0 || isAdding || selectedItems.length === 0}
        onClick={handleAddToCart}
      >
        {stockQuantity === 0
          ? "품절"
          : isAdding
            ? "추가 중..."
            : "장바구니에 추가"}
      </Button>

      <AddToCartDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        items={addedItems}
        totalItems={totalItems}
      />
    </>
  );
}

