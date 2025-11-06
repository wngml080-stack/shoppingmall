/**
 * @file components/Footer.tsx
 * @description 푸터 컴포넌트
 *
 * Fit kong 쇼핑몰의 하단 푸터 섹션입니다.
 * 소셜 미디어 아이콘, 네비게이션 링크, 사업자 정보를 포함합니다.
 *
 * 주요 기능:
 * 1. 소셜 미디어 아이콘 표시 (인스타그램, 웹, 카카오톡)
 * 2. 네비게이션 링크 (홈, 상품, 장바구니, 마이페이지)
 * 3. 사업자 정보 표시
 * 4. 저작권 정보
 *
 * @dependencies
 * - next/link: Link 컴포넌트
 * - lucide-react: 아이콘 (Instagram, Globe, MessageCircle)
 */

import Link from "next/link";
import { Instagram, Globe, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 소셜 미디어 아이콘 */}
        <div className="flex justify-center gap-6 mb-8">
          <Instagram className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" />
          <Globe className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" />
          <MessageCircle className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" />
        </div>

        {/* 네비게이션 링크 */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity text-sm"
          >
            홈
          </Link>
          <span className="text-blue-400">/</span>
          <Link
            href="/products"
            className="hover:opacity-80 transition-opacity text-sm"
          >
            상품
          </Link>
          <span className="text-blue-400">/</span>
          <Link
            href="/cart"
            className="hover:opacity-80 transition-opacity text-sm"
          >
            장바구니
          </Link>
          <span className="text-blue-400">/</span>
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity text-sm"
          >
            마이페이지
          </Link>
        </div>

        {/* 구분선 */}
        <div className="border-t border-blue-700 pt-8">
          {/* 사업자 정보 */}
          <div className="text-center text-sm text-blue-200 space-y-2 mb-4">
            <p>
              상호: Fit kong | 대표: 김소연 | 주소: 서울특별시 강남구 | 사업자등록번호: 000-00-000000
            </p>
          </div>

          {/* 저작권 */}
          <div className="text-center text-xs text-blue-300">
            <p>© 2025 Fit kong. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

