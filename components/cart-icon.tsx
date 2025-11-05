/**
 * @file components/cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트
 *
 * Navbar에 표시되는 장바구니 아이콘과 배지를 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이콘 표시
 * 2. 장바구니 아이템 개수 배지 표시
 * 3. 클릭 시 장바구니 페이지로 이동
 *
 * @dependencies
 * - react: useEffect, useState 훅 사용
 * - next/link: Link 컴포넌트
 * - @clerk/nextjs: useAuth, useUser
 * - lucide-react: ShoppingCart 아이콘
 * - @/actions/cart: getCartItemCount
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { getCartItemCount } from "@/actions/cart";

/**
 * 장바구니 아이콘 컴포넌트
 */
export function CartIcon() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 장바구니 아이템 개수 조회
  useEffect(() => {
    if (!isSignedIn || !user) {
      setItemCount(0);
      setIsLoading(false);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const count = await getCartItemCount(user.id);
        setItemCount(count);
      } catch (error) {
        console.error("장바구니 개수 조회 오류:", error);
        setItemCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartCount();

    // 페이지 포커스 시 다시 조회 (다른 탭에서 장바구니 추가 후 돌아올 때)
    const handleFocus = () => {
      fetchCartCount();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isSignedIn, user]);

  // 로그인하지 않은 경우 표시하지 않음
  if (!isSignedIn) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="장바구니"
    >
      <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      {!isLoading && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

