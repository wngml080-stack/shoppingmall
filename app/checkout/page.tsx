/**
 * @file app/checkout/page.tsx
 * @description 주문 페이지
 *
 * 사용자의 장바구니 아이템을 확인하고 주문을 생성하는 페이지입니다.
 *
 * 주요 기능:
 * 1. 로그인 체크 (미로그인 시 리다이렉트)
 * 2. 장바구니 데이터 조회
 * 3. 빈 장바구니 체크
 * 4. 주문 폼 컴포넌트 렌더링
 *
 * 로딩, 에러, 빈 상태 처리를 포함합니다.
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCartItems } from "@/actions/cart";
import { CheckoutForm } from "./checkout-form";

/**
 * 주문 페이지 메인 컴포넌트
 */
export default async function CheckoutPage() {
  // 로그인한 사용자 확인
  const user = await currentUser();

  if (!user) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    redirect("/sign-in");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <Link href="/cart">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            장바구니로 돌아가기
          </Button>
        </Link>

        {/* 페이지 제목 */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          주문하기
        </h1>

        {/* 주문 폼 - Suspense로 감싸서 로딩 상태 처리 */}
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutContent clerkId={user.id} />
        </Suspense>
      </div>
    </main>
  );
}

/**
 * 주문 내용 컴포넌트 (Server Component)
 */
interface CheckoutContentProps {
  clerkId: string;
}

async function CheckoutContent({ clerkId }: CheckoutContentProps) {
  try {
    // 장바구니 아이템 조회
    const cartItems = await getCartItems(clerkId);

    console.group("주문 페이지 데이터 확인");
    console.log("조회된 아이템 개수:", cartItems.length);
    console.log("아이템 목록:", cartItems);
    console.groupEnd();

    // 빈 장바구니 처리
    if (cartItems.length === 0) {
      return <EmptyCart />;
    }

    // 주문 폼 렌더링
    return <CheckoutForm cartItems={cartItems} clerkId={clerkId} />;
  } catch (error) {
    console.error("주문 페이지 오류:", error);

    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            주문 페이지를 불러올 수 없습니다
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            {error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/cart">
              <Button variant="outline" size="sm">
                장바구니로 돌아가기
              </Button>
            </Link>
            <Link href="/products">
              <Button size="sm">상품 목록으로 돌아가기</Button>
            </Link>
          </div>
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
          주문할 상품을 장바구니에 추가해주세요.
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
  );
}

/**
 * 로딩 상태 스켈레톤 컴포넌트
 */
function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      {/* 폼 영역 스켈레톤 */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주문 요약 영역 스켈레톤 */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6" />
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

