/**
 * @file app/products/[id]/page.tsx
 * @description 상품 상세 페이지
 *
 * 특정 상품의 상세 정보를 표시하는 페이지입니다.
 * 2열 레이아웃 구조로 구성되며, 왼쪽에는 제품 이미지, 오른쪽에는 상품 정보를 표시합니다.
 *
 * 오른쪽 열 정보 순서:
 * 1. 제품 이름
 * 2. 가격
 * 3. 재고 표시
 * 4. 카테고리 태그
 * 5. 상품 설명
 * 6. 등록일
 * 7. 장바구니 추가 버튼 (하단)
 *
 * 로딩, 에러, 빈 상태 처리를 포함합니다.
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { ProductSelector } from "@/components/product-selector";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 상품 상세 페이지 메인 컴포넌트
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  // Next.js 15에서는 params를 await 해야 함
  const { id } = await params;

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Button>
        </Link>

        {/* 상품 상세 정보 - Suspense로 감싸서 로딩 상태 처리 */}
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetailContent id={id} />
        </Suspense>
      </div>
    </main>
  );
}

/**
 * 상품 상세 정보 컨텐츠 컴포넌트 (Server Component)
 */
interface ProductDetailContentProps {
  id: string;
}

async function ProductDetailContent({ id }: ProductDetailContentProps) {
  try {
    // 상품 정보 조회
    const product = await getProductById(id);

    // 상품이 없으면 404 페이지 표시
    if (!product) {
      notFound();
    }

    // 가격 포맷팅 (천 단위 콤마)
    const formattedPrice = new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(product.price);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* 상품 이미지 영역 */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
            {product.category ? (
              <Image
                src={`https://placehold.co/800x800/3b82f6/ffffff?text=${encodeURIComponent(product.category)}`}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 text-6xl font-medium">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* 상품 정보 영역 */}
          <div className="flex flex-col justify-between">
            <div>
              {/* 1. 제품 이름 */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {product.name}
              </h1>

              {/* 2. 가격 */}
              <p className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {formattedPrice}
              </p>

              {/* 3. 재고 표시 */}
              <div className="mb-6">
                {product.stock_quantity === 0 ? (
                  <p className="text-lg text-red-500 font-semibold">품절</p>
                ) : product.stock_quantity < 10 ? (
                  <p className="text-lg text-orange-500 font-semibold">
                    남은 수량: {product.stock_quantity}개
                  </p>
                ) : (
                  <p className="text-lg text-green-600 dark:text-green-400 font-semibold">
                    재고 있음
                  </p>
                )}
              </div>

              {/* 4. 카테고리 태그 */}
              {product.category && (
                <span className="inline-block text-sm text-gray-500 dark:text-gray-400 mb-6 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {product.category}
                </span>
              )}

              {/* 5. 상품 설명 */}
              {product.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    상품 설명
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* 옵션 선택 (색상/수량) */}
              <div className="mb-6">
                <ProductSelector stockQuantity={product.stock_quantity} />
              </div>

              {/* 6. 등록일 */}
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>
                  등록일: {new Date(product.created_at).toLocaleDateString("ko-KR")}
                </p>
                {product.updated_at !== product.created_at && (
                  <p>
                    수정일: {new Date(product.updated_at).toLocaleDateString("ko-KR")}
                  </p>
                )}
              </div>
            </div>

            {/* 장바구니 추가 버튼 (추후 구현) */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                size="lg"
                className="w-full"
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity === 0
                  ? "품절"
                  : "장바구니에 추가"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("상품 상세 조회 오류:", error);

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
          <Link href="/products" className="mt-6 inline-block">
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
 * 로딩 상태 스켈레톤 컴포넌트
 */
function ProductDetailSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        {/* 왼쪽: 이미지 스켈레톤 */}
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />

        {/* 오른쪽: 정보 스켈레톤 */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* 제품 이름 스켈레톤 */}
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

            {/* 가격 스켈레톤 */}
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />

            {/* 재고 표시 스켈레톤 */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />

            {/* 카테고리 태그 스켈레톤 */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3" />

            {/* 상품 설명 스켈레톤 */}
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
            </div>

            {/* 등록일 스켈레톤 */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>

          {/* 장바구니 버튼 스켈레톤 */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

