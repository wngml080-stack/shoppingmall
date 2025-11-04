/**
 * @file app/page.tsx
 * @description 홈페이지 - 상품 목록 Grid 레이아웃
 *
 * 최신 상품을 Grid 레이아웃으로 표시하는 홈페이지입니다.
 * 반응형 디자인을 지원하며, 모바일/태블릿/데스크톱에 최적화되어 있습니다.
 */

import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { ProductCard } from "@/components/product-card";

/**
 * 상품 목록 섹션 (Server Component)
 */
async function ProductList() {
  try {
    const products = await getProducts(12);

    if (products.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            등록된 상품이 없습니다.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("상품 목록 로드 오류:", error);

    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            상품을 불러올 수 없습니다
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            {error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다."}
          </p>
          <div className="text-xs text-red-600 dark:text-red-400 text-left space-y-1">
            <p className="font-semibold">확인 사항:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>.env 파일에 Supabase 환경 변수가 설정되어 있는지 확인</li>
              <li>Supabase 프로젝트가 활성화되어 있는지 확인</li>
              <li>products 테이블이 생성되어 있는지 확인</li>
              <li>서버를 재시작했는지 확인</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * 로딩 상태 컴포넌트
 */
function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 홈페이지 메인 컴포넌트
 */
export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            쇼핑몰에 오신 것을 환영합니다
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            최신 상품을 확인하고 마음에 드는 상품을 찾아보세요
          </p>
        </section>

        {/* 상품 목록 섹션 */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            최신 상품
          </h2>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList />
          </Suspense>
        </section>
      </div>
    </main>
  );
}