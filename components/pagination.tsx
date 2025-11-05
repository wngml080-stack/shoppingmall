/**
 * @file components/pagination.tsx
 * @description 페이지네이션 컴포넌트
 *
 * 상품 목록 페이지에서 페이지 네비게이션을 제공하는 컴포넌트입니다.
 * URL 쿼리 파라미터를 통해 페이지 상태를 관리합니다.
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * 페이지네이션 컴포넌트
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * 페이지 변경 핸들러
   */
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 페이지 번호 배열 생성 (현재 페이지 ±2 범위 + 첫/마지막 페이지)
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      // 총 페이지가 7개 이하면 모두 표시
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const showEllipsis = (page: number) => {
      if (!pages.includes(page)) {
        pages.push(page);
      }
    };

    // 첫 페이지
    pages.push(1);

    // 현재 페이지 주변 계산
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    // 첫 페이지와 시작 페이지 사이에 ellipsis가 필요한지 확인
    if (startPage > 2) {
      pages.push("...");
    }

    // 현재 페이지 주변 페이지들
    for (let i = startPage; i <= endPage; i++) {
      showEllipsis(i);
    }

    // 끝 페이지와 마지막 페이지 사이에 ellipsis가 필요한지 확인
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // 마지막 페이지
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 페이지가 없으면 컴포넌트를 렌더링하지 않음
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      {/* 페이지 정보 */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {startItem}-{endItem} / 총 {totalItems}개
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="flex items-center gap-2">
        {/* 이전 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">이전</span>
        </Button>

        {/* 페이지 번호 버튼들 */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-500 dark:text-gray-400"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "min-w-[2.5rem]",
                  isActive && "bg-blue-600 hover:bg-blue-700 text-white"
                )}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* 다음 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">다음</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

