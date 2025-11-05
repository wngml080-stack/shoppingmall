/**
 * @file components/cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트
 *
 * Navbar(GNB)에 표시되는 장바구니 아이콘과 배지를 표시하는 컴포넌트입니다.
 * 로그인 상태와 관계없이 항상 표시되며, 로그인하지 않은 사용자가 클릭하면 로그인 페이지로 이동합니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이콘 표시 (로그인 상태와 관계없이 항상 표시)
 * 2. 장바구니 아이템 개수 배지 표시 (로그인한 사용자만)
 * 3. 클릭 시 장바구니 페이지로 이동 (로그인한 경우) 또는 로그인 페이지로 이동 (로그인하지 않은 경우)
 * 4. 실시간 배지 업데이트 (장바구니 변경 시)
 *
 * @dependencies
 * - react: useEffect, useState 훅 사용
 * - next/navigation: useRouter
 * - @clerk/nextjs: useAuth, useUser
 * - lucide-react: ShoppingCart 아이콘
 * - @/actions/cart: getCartItemCount
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { getCartItemCount } from "@/actions/cart";

/**
 * 장바구니 아이콘 컴포넌트
 */
export function CartIcon() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
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

    // 장바구니 추가 후 즉시 업데이트를 위한 커스텀 이벤트 리스너
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [isSignedIn, user]);

  /**
   * 장바구니 아이콘 클릭 핸들러
   * 로그인하지 않은 경우 로그인 페이지로 이동
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    
    router.push("/cart");
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isSignedIn ? `장바구니 (${itemCount}개 아이템)` : "장바구니"}
      aria-live="polite"
      type="button"
      disabled={isLoading}
    >
      <ShoppingCart 
        className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-transform hover:scale-110" 
      />
      {isSignedIn && !isLoading && itemCount > 0 && (
        <span 
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm"
          aria-label={`${itemCount}개의 아이템`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}

