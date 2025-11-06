/**
 * @file components/Navbar.tsx
 * @description 네비게이션 바 컴포넌트
 *
 * 상단 네비게이션 바로, 로고, 메뉴, 장바구니, 로그인 버튼을 포함합니다.
 *
 * 주요 기능:
 * 1. 로고 클릭 시 홈으로 이동
 * 2. 상품 메뉴 (상품 목록 페이지로 이동)
 * 3. 베스트 상품 메뉴 (인기순 정렬된 상품 목록으로 이동)
 * 4. 장바구니 아이콘
 * 5. 로그인/회원가입 버튼 (Clerk)
 */

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/cart-icon";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 h-16 max-w-7xl mx-auto w-full">
      {/* 좌측: 로고 */}
      <Link href="/" className="text-2xl font-bold flex-shrink-0">
        Fit kong
      </Link>
      
      {/* 우측: 메뉴 및 사용자 액션 */}
      <div className="flex items-center gap-6 ml-auto">
        {/* 상품 메뉴 */}
        <Link
          href="/products"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors hidden sm:block"
        >
          상품
        </Link>
        {/* 베스트 상품 메뉴 */}
        <Link
          href="/products?sort=popular"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors hidden sm:block"
        >
          베스트 상품
        </Link>
        {/* 장바구니 아이콘 */}
        <div className="flex items-center">
          <CartIcon />
        </div>
        {/* 로그인/사용자 버튼 */}
        <SignedOut>
          <SignInButton mode="modal">
            <Button>로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
