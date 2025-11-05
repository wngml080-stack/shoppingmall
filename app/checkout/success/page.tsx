/**
 * @file app/checkout/success/page.tsx
 * @description 주문 완료 페이지
 *
 * 주문이 성공적으로 완료되었음을 표시하는 페이지입니다.
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/actions/orders";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }> | { orderId?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Next.js 15에서는 searchParams가 Promise일 수 있음
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    redirect("/cart");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<SuccessSkeleton />}>
          <SuccessContent orderId={orderId} clerkId={user.id} />
        </Suspense>
      </div>
    </main>
  );
}

interface SuccessContentProps {
  orderId: string;
  clerkId: string;
}

async function SuccessContent({ orderId, clerkId }: SuccessContentProps) {
  try {
    const order = await getOrderById(orderId, clerkId);

    if (!order) {
      return (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              주문을 찾을 수 없습니다
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              주문 정보를 불러올 수 없습니다.
            </p>
            <Link href="/cart">
              <Button variant="outline" size="sm">
                장바구니로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    const formattedTotal = new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(order.total_amount);

    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          {/* 성공 아이콘 */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* 성공 메시지 */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            주문이 완료되었습니다!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            주문이 성공적으로 접수되었습니다.
            <br />
            주문 내역은 마이페이지에서 확인하실 수 있습니다.
          </p>

          {/* 주문 정보 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">주문 번호</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {order.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">주문 일시</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {new Date(order.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">주문 상태</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {order.status === "pending" && "대기 중"}
                  {order.status === "confirmed" && "확인됨"}
                  {order.status === "shipped" && "배송 중"}
                  {order.status === "delivered" && "배송 완료"}
                  {order.status === "cancelled" && "취소됨"}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    총 주문 금액
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formattedTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto">
                쇼핑 계속하기
              </Button>
            </Link>
            <Link href="/mypage/orders">
              <Button className="w-full sm:w-auto">
                주문 내역 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("주문 완료 페이지 오류:", error);
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            주문 정보를 불러올 수 없습니다
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            {error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."}
          </p>
          <Link href="/cart">
            <Button variant="outline" size="sm">
              장바구니로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

function SuccessSkeleton() {
  return (
    <div className="text-center py-16 px-4 animate-pulse">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-8" />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

