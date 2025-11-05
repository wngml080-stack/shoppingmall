/**
 * @file components/sort-filter.tsx
 * @description 정렬 필터 컴포넌트
 *
 * 상품 목록을 다양한 기준으로 정렬할 수 있는 드롭다운 컴포넌트입니다.
 * URL 쿼리 파라미터를 통해 정렬 상태를 관리합니다.
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/actions/products";

/**
 * 정렬 옵션 라벨 매핑
 */
const sortLabels: Record<SortOption, string> = {
  latest: "최신순",
  price_asc: "가격 낮은순",
  price_desc: "가격 높은순",
  popular: "인기순",
};

/**
 * 정렬 필터 컴포넌트
 */
export function SortFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSort = (searchParams.get("sort") as SortOption) || "latest";

  /**
   * 정렬 옵션 변경 핸들러
   */
  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "latest") {
      // 기본값이면 파라미터에서 제거
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    
    // 정렬 변경 시 페이지는 1로 리셋
    params.delete("page");
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        정렬:
      </label>
      <Select value={selectedSort} onValueChange={handleSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          <SelectValue placeholder="정렬 기준 선택" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(sortLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

