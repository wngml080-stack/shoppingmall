/**
 * @file app/products/[id]/not-found.tsx
 * @description 상품을 찾을 수 없을 때 표시되는 404 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          상품을 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          요청하신 상품이 존재하지 않거나 삭제되었습니다.
        </p>
        <Link href="/">
          <Button size="lg">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </main>
  );
}

