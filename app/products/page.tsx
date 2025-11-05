/**
 * @file app/products/page.tsx
 * @description 상품 목록 페이지
 *
 * 모든 상품을 페이지네이션과 함께 표시하는 페이지입니다.
 * 카테고리 필터링 기능을 지원하며, 반응형 디자인을 지원합니다.
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  getProductsWithPagination,
  getProductsByCategoryWithPagination,
  getProductsCount,
  getProductsCountByCategory,
  type SortOption,
} from "@/actions/products";
import { ProductCard } from "@/components/product-card";
import { CategoryFilter } from "@/components/category-filter";
import { SortFilter } from "@/components/sort-filter";
import { Pagination } from "@/components/pagination";

interface ProductListProps {
  category: string | null;
  page: number;
  limit: number;
  sortBy: SortOption;
}

/**
 * 상품 목록 섹션 (Server Component)
 */
async function ProductList({ category, page, limit, sortBy }: ProductListProps) {
  try {
    const products = category
      ? await getProductsByCategoryWithPagination(category, page, limit, sortBy)
      : await getProductsWithPagination(page, limit, sortBy);

    if (products.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {category ? "해당 카테고리에 등록된 상품이 없습니다." : "등록된 상품이 없습니다."}
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
 * 페이지네이션 정보 섹션 (Server Component)
 */
interface PaginationInfoProps {
  category: string | null;
  page: number;
  limit: number;
}

async function PaginationInfo({ category, page, limit }: PaginationInfoProps) {
  try {
    const totalItems = category
      ? await getProductsCountByCategory(category)
      : await getProductsCount();
    
    const totalPages = Math.ceil(totalItems / limit);

    // 페이지 번호가 유효하지 않으면 1페이지로 리다이렉트
    if (page < 1 || (totalPages > 0 && page > totalPages)) {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      params.set("page", "1");
      redirect(`/products?${params.toString()}`);
    }

    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
      />
    );
  } catch (error) {
    console.error("페이지네이션 정보 로드 오류:", error);
    return null;
  }
}

/**
 * 로딩 상태 컴포넌트
 */
function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
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
 * 상품 목록 페이지 메인 컴포넌트
 */
interface ProductsPageProps {
  searchParams: Promise<{ category?: string; page?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category || null;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 12;
  const sortBy = (params.sort as SortOption) || "latest";

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        {/* 페이지 헤더 */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            상품 목록
          </h1>
          <CategoryFilter />
          <SortFilter />
        </section>

        {/* 상품 목록 섹션 */}
        <section>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={category} page={page} limit={limit} sortBy={sortBy} />
          </Suspense>
        </section>

        {/* 페이지네이션 섹션 */}
        <Suspense fallback={null}>
          <PaginationInfo category={category} page={page} limit={limit} />
        </Suspense>
      </div>
    </main>
  );
}

