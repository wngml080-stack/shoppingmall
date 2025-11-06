/**
 * @file components/popular-products-section.tsx
 * @description 인기 상품 섹션 컴포넌트
 *
 * 주문 수량이 많은 인기 상품을 표시하는 섹션입니다.
 * 주문 데이터가 없으면 최신 상품을 표시합니다.
 */

import { Suspense } from "react";
import { getPopularProducts } from "@/actions/products";
import { ProductCard } from "@/components/product-card";

/**
 * 인기 상품 목록 (Server Component)
 */
async function PopularProductsList() {
  try {
    const products = await getPopularProducts(6);

    if (products.length === 0) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("인기 상품 목록 로드 오류:", error);
    return null; // 에러 발생 시 섹션을 숨김
  }
}

/**
 * 인기 상품 로딩 스켈레톤
 */
function PopularProductsSkeleton() {
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
 * 인기 상품 섹션 컴포넌트
 */
export function PopularProductsSection() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        인기 상품
      </h2>
      <Suspense fallback={<PopularProductsSkeleton />}>
        <PopularProductsList />
      </Suspense>
    </section>
  );
}


