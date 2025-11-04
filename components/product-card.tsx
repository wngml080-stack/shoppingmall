/**
 * @file components/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * 상품 이미지, 이름, 가격, 카테고리 정보를 표시하고,
 * 클릭 시 상품 상세 페이지로 이동합니다.
 */

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // 가격 포맷팅 (천 단위 콤마)
  const formattedPrice = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(product.price);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* 상품 이미지 영역 */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        {product.category ? (
          <Image
            src={`https://placehold.co/400x400/3b82f6/ffffff?text=${encodeURIComponent(product.category)}`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* 상품 정보 영역 */}
      <div className="p-4">
        {/* 카테고리 */}
        {product.category && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
            {product.category}
          </span>
        )}

        {/* 상품명 */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* 가격 */}
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {formattedPrice}
        </p>

        {/* 재고 상태 */}
        {product.stock_quantity === 0 && (
          <p className="text-sm text-red-500 mt-2">품절</p>
        )}
        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
          <p className="text-sm text-orange-500 mt-2">
            남은 수량: {product.stock_quantity}개
          </p>
        )}
      </div>
    </Link>
  );
}
