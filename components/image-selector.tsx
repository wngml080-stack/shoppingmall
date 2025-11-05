/**
 * @file components/image-selector.tsx
 * @description Unsplash 이미지 검색 및 선택 컴포넌트
 *
 * 사용자가 Unsplash에서 무료 이미지를 검색하고 선택할 수 있는 컴포넌트입니다.
 * 선택한 이미지는 Supabase Storage에 저장하거나 URL을 직접 사용할 수 있습니다.
 */

"use client";

import { useState, useEffect } from "react";
import { searchUnsplashImages, getUnsplashImageUrl, type UnsplashPhoto } from "@/lib/unsplash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LuSearch, LuLoader, LuCheck, LuImage } from "react-icons/lu";
import Image from "next/image";

interface ImageSelectorProps {
  onSelect: (imageUrl: string, photo: UnsplashPhoto) => void;
  initialQuery?: string;
  className?: string;
}

export function ImageSelector({ onSelect, initialQuery = "", className = "" }: ImageSelectorProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // 검색 실행
  const handleSearch = async (searchQuery: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await searchUnsplashImages(searchQuery, pageNum, 20);
      if (pageNum === 1) {
        setResults(response.results);
      } else {
        setResults((prev) => [...prev, ...response.results]);
      }
      setPage(pageNum);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이미지 검색에 실패했습니다."
      );
      console.error("Image search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 검색어 입력 후 엔터 또는 검색 버튼 클릭
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    handleSearch(query, 1);
  };

  // 이미지 선택
  const handleSelect = (photo: UnsplashPhoto) => {
    setSelectedImageId(photo.id);
    const imageUrl = getUnsplashImageUrl(photo, "regular");
    onSelect(imageUrl, photo);
  };

  // 초기 검색어가 있으면 자동 검색
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      {/* 검색 입력 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="이미지 검색 (예: fashion, clothing, shoes...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LuLoader className="w-4 h-4 mr-2 animate-spin" />
                검색 중...
              </>
            ) : (
              <>
                <LuSearch className="w-4 h-4 mr-2" />
                검색
              </>
            )}
          </Button>
        </div>
      </form>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 검색 결과 */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map((photo) => {
              const isSelected = selectedImageId === photo.id;
              const imageUrl = getUnsplashImageUrl(photo, "small");

              return (
                <div
                  key={photo.id}
                  className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => handleSelect(photo)}
                >
                  {/* 이미지 */}
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={photo.alt_description || photo.description || "Unsplash image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                    {/* 선택 표시 */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-2">
                          <LuCheck className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* 이미지 정보 (호버 시) */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">
                      by {photo.user.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 더 보기 버튼 */}
          {results.length >= 20 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => handleSearch(query, page + 1)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LuLoader className="w-4 h-4 mr-2 animate-spin" />
                    로딩 중...
                  </>
                ) : (
                  "더 보기"
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 검색 결과가 없을 때 */}
      {!loading && query && results.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <LuImage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>검색 결과가 없습니다.</p>
          <p className="text-sm mt-2">다른 검색어를 시도해보세요.</p>
        </div>
      )}

      {/* 초기 상태 */}
      {!query && results.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <LuSearch className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>위에서 이미지를 검색해보세요.</p>
          <p className="text-sm mt-2">
            예: fashion, clothing, shoes, electronics 등
          </p>
        </div>
      )}
    </div>
  );
}

