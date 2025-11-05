/**
 * @file components/category-filter.tsx
 * @description 카테고리 필터 컴포넌트
 *
 * 상품 목록을 카테고리별로 필터링할 수 있는 버튼 컴포넌트입니다.
 * URL 쿼리 파라미터를 통해 필터링 상태를 관리합니다.
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 카테고리 라벨 매핑 (영어 → 한글)
 */
const categoryLabels: Record<string, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

/**
 * 사용 가능한 카테고리 목록
 */
const categories = [
  null, // 전체
  "electronics",
  "clothing",
  "books",
  "food",
  "sports",
  "beauty",
  "home",
] as const;

/**
 * 카테고리 필터 컴포넌트
 */
export function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  /**
   * 카테고리 선택 핸들러
   */
  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    
    // 카테고리 변경 시 페이지는 1로 리셋
    params.delete("page");
    
    // 현재 경로에 따라 적절한 URL로 이동
    const basePath = pathname === "/products" ? "/products" : "/";
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {categories.map((category) => {
          const label = category ? categoryLabels[category] : "전체";
          const isSelected = selectedCategory === category || (!selectedCategory && category === null);

          return (
            <Button
              key={category || "all"}
              onClick={() => handleCategoryClick(category)}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={cn(
                "whitespace-nowrap",
                isSelected && "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

