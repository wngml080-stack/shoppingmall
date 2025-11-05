/**
 * @file app/checkout/page.tsx
 * @description 주문 페이지 (준비 중)
 *
 * 주문 기능은 Phase 3에서 구현 예정입니다.
 * 현재는 준비 중 메시지를 표시합니다.
 */

import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <Link href="/cart">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            장바구니로 돌아가기
          </Button>
        </Link>

        {/* 준비 중 메시지 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="mb-6 flex justify-center">
                <ShoppingCart className="h-24 w-24 text-gray-300 dark:text-gray-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                주문 기능 준비 중
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                주문 기능은 현재 개발 중입니다.
                <br />
                곧 이용하실 수 있도록 준비하고 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/cart">
                  <Button variant="outline">장바구니로 돌아가기</Button>
                </Link>
                <Link href="/products">
                  <Button>쇼핑 계속하기</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

