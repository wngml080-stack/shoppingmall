/**
 * @file lib/unsplash.ts
 * @description Unsplash API 클라이언트 유틸리티
 *
 * Unsplash API를 사용하여 무료 이미지를 검색하고 가져오는 기능을 제공합니다.
 * 
 * 사용 방법:
 * 1. Unsplash 개발자 페이지에서 무료 API 키 발급
 * 2. .env 파일에 NEXT_PUBLIC_UNSPLASH_ACCESS_KEY 추가
 * 3. 이 파일의 함수들을 사용하여 이미지 검색 및 가져오기
 */

const UNSPLASH_API_URL = "https://api.unsplash.com";

/**
 * Unsplash API 응답 타입
 */
export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  width: number;
  height: number;
  user: {
    name: string;
    username: string;
  };
  links: {
    download: string;
    download_location: string;
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

/**
 * Unsplash에서 이미지 검색
 * @param query 검색어 (예: "fashion", "clothing", "shoes")
 * @param page 페이지 번호 (기본값: 1)
 * @param perPage 페이지당 결과 수 (기본값: 20, 최대: 30)
 * @returns 검색 결과
 */
export async function searchUnsplashImages(
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<UnsplashSearchResponse> {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      "Unsplash API 키가 설정되지 않았습니다. NEXT_PUBLIC_UNSPLASH_ACCESS_KEY 환경변수를 확인해주세요."
    );
  }

  const url = new URL(`${UNSPLASH_API_URL}/search/photos`);
  url.searchParams.append("query", query);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("per_page", Math.min(perPage, 30).toString());

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Unsplash API 오류: ${response.status} - ${error.errors?.[0] || response.statusText}`
    );
  }

  return response.json();
}

/**
 * Unsplash에서 랜덤 이미지 가져오기
 * @param query 검색어 (선택사항)
 * @param count 가져올 이미지 수 (기본값: 10, 최대: 30)
 * @returns 랜덤 이미지 목록
 */
export async function getRandomUnsplashImages(
  query?: string,
  count: number = 10
): Promise<UnsplashPhoto[]> {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      "Unsplash API 키가 설정되지 않았습니다. NEXT_PUBLIC_UNSPLASH_ACCESS_KEY 환경변수를 확인해주세요."
    );
  }

  const url = new URL(`${UNSPLASH_API_URL}/photos/random`);
  if (query) {
    url.searchParams.append("query", query);
  }
  url.searchParams.append("count", Math.min(count, 30).toString());

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Unsplash API 오류: ${response.status} - ${error.errors?.[0] || response.statusText}`
    );
  }

  return response.json();
}

/**
 * 이미지 URL을 Supabase Storage에 저장하기 위한 다운로드 URL 생성
 * @param photo Unsplash 이미지 객체
 * @param size 이미지 크기 ('small', 'regular', 'full')
 * @returns 이미지 URL
 */
export function getUnsplashImageUrl(
  photo: UnsplashPhoto,
  size: "small" | "regular" | "full" = "regular"
): string {
  return photo.urls[size];
}

