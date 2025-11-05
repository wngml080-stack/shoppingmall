/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니에 담긴 상품 목록을 표시하고, 수량 변경 및 삭제 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이템 목록 표시
 * 2. 수량 변경 기능
 * 3. 아이템 삭제 기능
 * 4. 총 금액 계산 및 표시
 * 5. 빈 장바구니 상태 UI
 * 6. 로그인 체크
 *
 * 로딩, 에러, 빈 상태 처리를 포함합니다.
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartItems, calculateCartSummary } from "@/actions/cart";
import { CartItem } from "@/components/cart-item";
import { Button } from "@/components/ui/button";

/**
 * 장바구니 페이지 메인 컴포넌트
 */
export default async function CartPage() {
  // 로그인한 사용자 확인
  const user = await currentUser();

  if (!user) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    redirect("/sign-in");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* 페이지 제목 */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          장바구니
        </h1>

        {/* 장바구니 내용 - Suspense로 감싸서 로딩 상태 처리 */}
        <Suspense fallback={<CartSkeleton />}>
          <CartContent clerkId={user.id} />
        </Suspense>
      </div>
    </main>
  );
}

/**
 * 장바구니 내용 컴포넌트 (Server Component)
 */
interface CartContentProps {
  clerkId: string;
}

async function CartContent({ clerkId }: CartContentProps) {
  try {
    // 장바구니 아이템 조회
    const cartItems = await getCartItems(clerkId);

    // 빈 장바구니 처리
    if (cartItems.length === 0) {
      return <EmptyCart />;
    }

    // 총액 계산
    const summary = calculateCartSummary(cartItems);

    // 총액 포맷팅
    const formattedTotal = new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(summary.totalAmount);

    return (
      <div className="space-y-6">
        {/* 장바구니 아이템 목록 */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
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
  } catch (error) {
    console.error("장바구니 조회 오류:", error);

    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            장바구니를 불러올 수 없습니다
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            {error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다."}
          </p>
          <Link href="/products">
            <Button variant="outline" size="sm">
              상품 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

/**
 * 빈 장바구니 상태 컴포넌트
 */
function EmptyCart() {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          <ShoppingCart className="h-24 w-24 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          장바구니가 비어있습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          원하는 상품을 장바구니에 추가해보세요.
        </p>
        <Link href="/products">
          <Button size="lg">쇼핑 계속하기</Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * 로딩 상태 스켈레톤 컴포넌트
 */
function CartSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          {/* 이미지 스켈레톤 */}
          <div className="w-full sm:w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />

          {/* 정보 스켈레톤 */}
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>

          {/* 액션 스켈레톤 */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

