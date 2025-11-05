/**
 * @file actions/products.ts
 * @description 상품 관련 Server Actions
 *
 * Supabase에서 상품 데이터를 조회하는 Server Actions입니다.
 * Service Role 클라이언트를 사용하여 RLS를 우회합니다.
 */

"use server";

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type { Product } from "@/types/product";

/**
 * 상품 목록 조회
 * @param limit - 조회할 상품 수 (기본값: 12)
 * @returns 상품 목록 배열
 */
export async function getProducts(limit: number = 12): Promise<Product[]> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      
      console.error(`환경 변수 누락: ${missingVars.join(", ")}`);
      throw new Error(`환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`);
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      // 에러 객체의 모든 속성을 문자열로 변환하여 로깅
      const errorInfo = {
        message: error.message || "메시지 없음",
        details: error.details || "상세 정보 없음",
        hint: error.hint || "힌트 없음",
        code: error.code || "코드 없음",
      };
      
      console.error("상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
      throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    // 에러 객체를 더 명확하게 로깅
    if (error instanceof Error) {
      const errorLog = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"), // 스택의 처음 5줄만
      };
      console.error("getProducts 오류:", JSON.stringify(errorLog, null, 2));
      throw error;
    } else {
      // 알 수 없는 타입의 에러
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("getProducts 알 수 없는 오류:", errorString);
      throw new Error("상품 조회 중 예상치 못한 오류가 발생했습니다.");
    }
  }
}

/**
 * 카테고리별 상품 목록 조회
 * @param category - 카테고리 이름 (null이면 전체 상품 조회)
 * @param limit - 조회할 상품 수 (기본값: 12)
 * @returns 상품 목록 배열
 */
export async function getProductsByCategory(
  category: string | null,
  limit: number = 12
): Promise<Product[]> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      
      console.error(`환경 변수 누락: ${missingVars.join(", ")}`);
      throw new Error(`환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`);
    }

    const supabase = getServiceRoleClient();

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    // 카테고리가 있으면 필터링, 없으면 전체 조회
    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      const errorInfo = {
        message: error.message || "메시지 없음",
        details: error.details || "상세 정보 없음",
        hint: error.hint || "힌트 없음",
        code: error.code || "코드 없음",
      };
      
      console.error("카테고리별 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
      throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    if (error instanceof Error) {
      const errorLog = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      };
      console.error("getProductsByCategory 오류:", JSON.stringify(errorLog, null, 2));
      throw error;
    } else {
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("getProductsByCategory 알 수 없는 오류:", errorString);
      throw new Error("상품 조회 중 예상치 못한 오류가 발생했습니다.");
    }
  }
}

/**
 * 인기 상품 목록 조회
 * @param limit - 조회할 상품 수 (기본값: 6)
 * @returns 인기 상품 목록 배열 (주문 수량 합계 기준)
 */
export async function getPopularProducts(limit: number = 6): Promise<Product[]> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      
      console.error(`환경 변수 누락: ${missingVars.join(", ")}`);
      throw new Error(`환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`);
    }

    const supabase = getServiceRoleClient();

    // order_items에서 product_id별 주문 수량 합계 조회
    const { data: orderData, error: orderError } = await supabase
      .from("order_items")
      .select("product_id, quantity");

    if (orderError) {
      // 테이블이 없는 경우(PGRST205)는 조용히 최신순으로 대체 (개발 초기 단계)
      if (orderError.code === "PGRST205") {
        // order_items 테이블이 아직 생성되지 않음 - 최신순으로 대체
        const { data: recentProducts, error: recentError } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (recentError) {
          const errorInfo = {
            message: recentError.message || "메시지 없음",
            details: recentError.details || "상세 정보 없음",
            hint: recentError.hint || "힌트 없음",
            code: recentError.code || "코드 없음",
          };
          console.error("최신 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
          throw new Error(`인기 상품 조회 실패: ${recentError.message || errorInfo.message}`);
        }

        return (recentProducts as Product[]) || [];
      }

      // 다른 에러는 로깅 후 최신순으로 대체
      const errorInfo = {
        message: orderError.message || "메시지 없음",
        details: orderError.details || "상세 정보 없음",
        hint: orderError.hint || "힌트 없음",
        code: orderError.code || "코드 없음",
      };
      console.error("주문 데이터 조회 오류:", JSON.stringify(errorInfo, null, 2));
      // 주문 데이터 조회 실패 시 최신 상품 반환
      const { data: recentProducts, error: recentError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (recentError) {
        const errorInfo = {
          message: recentError.message || "메시지 없음",
          details: recentError.details || "상세 정보 없음",
          hint: recentError.hint || "힌트 없음",
          code: recentError.code || "코드 없음",
        };
        console.error("최신 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
        throw new Error(`인기 상품 조회 실패: ${recentError.message || errorInfo.message}`);
      }

      return (recentProducts as Product[]) || [];
    }

    if (!orderData || orderData.length === 0) {
      // 주문 데이터가 없으면 최신 상품 반환
      const { data: recentProducts, error: recentError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (recentError) {
        const errorInfo = {
          message: recentError.message || "메시지 없음",
          details: recentError.details || "상세 정보 없음",
          hint: recentError.hint || "힌트 없음",
          code: recentError.code || "코드 없음",
        };
        console.error("최신 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
        throw new Error(`인기 상품 조회 실패: ${recentError.message || errorInfo.message}`);
      }

      return (recentProducts as Product[]) || [];
    }

    // product_id별로 quantity 합산
    const productQuantityMap = new Map<string, number>();
    orderData.forEach((item) => {
      const productId = item.product_id;
      const quantity = item.quantity || 0;
      productQuantityMap.set(
        productId,
        (productQuantityMap.get(productId) || 0) + quantity
      );
    });

    // 수량이 많은 순으로 정렬
    const sortedProductIds = Array.from(productQuantityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId]) => productId);

    if (sortedProductIds.length === 0) {
      // 정렬된 상품이 없으면 최신 상품 반환
      const { data: recentProducts, error: recentError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (recentError) {
        const errorInfo = {
          message: recentError.message || "메시지 없음",
          details: recentError.details || "상세 정보 없음",
          hint: recentError.hint || "힌트 없음",
          code: recentError.code || "코드 없음",
        };
        console.error("최신 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
        throw new Error(`인기 상품 조회 실패: ${recentError.message || errorInfo.message}`);
      }

      return (recentProducts as Product[]) || [];
    }

    // 상품 정보 조회
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .in("id", sortedProductIds);

    if (productsError) {
      const errorInfo = {
        message: productsError.message || "메시지 없음",
        details: productsError.details || "상세 정보 없음",
        hint: productsError.hint || "힌트 없음",
        code: productsError.code || "코드 없음",
      };
      console.error("상품 정보 조회 오류:", JSON.stringify(errorInfo, null, 2));
      throw new Error(`인기 상품 조회 실패: ${productsError.message || errorInfo.message}`);
    }

    // 정렬된 순서대로 반환
    const productMap = new Map(products.map((p) => [p.id, p]));
    const sortedProducts = sortedProductIds
      .map((id) => productMap.get(id))
      .filter((p): p is Product => p !== undefined);

    return sortedProducts;
  } catch (error) {
    if (error instanceof Error) {
      const errorLog = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      };
      console.error("getPopularProducts 오류:", JSON.stringify(errorLog, null, 2));
      
      // 에러 발생 시 최신 상품 반환 (fallback)
      try {
        const supabase = getServiceRoleClient();
        const { data: fallbackData } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(6);
        
        return (fallbackData as Product[]) || [];
      } catch (fallbackError) {
        console.error("Fallback 조회 실패:", fallbackError);
        throw error;
      }
    } else {
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("getPopularProducts 알 수 없는 오류:", errorString);
      throw new Error("인기 상품 조회 중 예상치 못한 오류가 발생했습니다.");
    }
  }
}

/**
 * 정렬 옵션 타입
 */
export type SortOption = "latest" | "price_asc" | "price_desc" | "popular";

/**
 * 상품 목록 조회 (페이지네이션 지원)
 * @param page - 페이지 번호 (1부터 시작)
 * @param limit - 페이지당 상품 수 (기본값: 12)
 * @param sortBy - 정렬 기준 (기본값: "latest")
 * @returns 상품 목록 배열
 */
export async function getProductsWithPagination(
  page: number = 1,
  limit: number = 12,
  sortBy: SortOption = "latest"
): Promise<Product[]> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      
      console.error(`환경 변수 누락: ${missingVars.join(", ")}`);
      throw new Error(`환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`);
    }

    const supabase = getServiceRoleClient();
    const offset = (page - 1) * limit;

    // 인기순 정렬의 경우 별도 처리
    if (sortBy === "popular") {
      // order_items에서 product_id별 quantity 합산
      const { data: orderData, error: orderError } = await supabase
        .from("order_items")
        .select("product_id, quantity");

      if (orderError) {
        // 테이블이 없는 경우(PGRST205)는 조용히 최신순으로 대체 (개발 초기 단계)
        if (orderError.code === "PGRST205") {
          // order_items 테이블이 아직 생성되지 않음 - 최신순으로 대체
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) {
            const errorInfo = {
              message: error.message || "메시지 없음",
              details: error.details || "상세 정보 없음",
              hint: error.hint || "힌트 없음",
              code: error.code || "코드 없음",
            };
            console.error("상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
            throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
          }

          return (data as Product[]) || [];
        }

        // 다른 에러는 로깅 후 최신순으로 대체
        const errorInfo = {
          message: orderError.message || "메시지 없음",
          details: orderError.details || "상세 정보 없음",
          hint: orderError.hint || "힌트 없음",
          code: orderError.code || "코드 없음",
        };
        console.error("주문 데이터 조회 오류:", JSON.stringify(errorInfo, null, 2));
        // 주문 데이터 조회 실패 시 최신순으로 대체
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          const errorInfo = {
            message: error.message || "메시지 없음",
            details: error.details || "상세 정보 없음",
            hint: error.hint || "힌트 없음",
            code: error.code || "코드 없음",
          };
          console.error("상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
          throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
        }

        return (data as Product[]) || [];
      }

      // product_id별로 quantity 합산
      const productQuantityMap = new Map<string, number>();
      if (orderData && orderData.length > 0) {
        orderData.forEach((item) => {
          const productId = item.product_id;
          const quantity = item.quantity || 0;
          productQuantityMap.set(
            productId,
            (productQuantityMap.get(productId) || 0) + quantity
          );
        });
      }

      // 수량이 많은 순으로 정렬된 product_id 목록
      const sortedProductIds = Array.from(productQuantityMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([productId]) => productId);

      if (sortedProductIds.length === 0) {
        // 주문 데이터가 없으면 최신순으로 대체
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          const errorInfo = {
            message: error.message || "메시지 없음",
            details: error.details || "상세 정보 없음",
            hint: error.hint || "힌트 없음",
            code: error.code || "코드 없음",
          };
          console.error("상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
          throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
        }

        return (data as Product[]) || [];
      }

      // 인기순으로 정렬된 상품들 가져오기 (페이지네이션 적용)
      const paginatedProductIds = sortedProductIds.slice(offset, offset + limit);
      
      if (paginatedProductIds.length === 0) {
        return [];
      }

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .in("id", paginatedProductIds);

      if (productsError) {
        const errorInfo = {
          message: productsError.message || "메시지 없음",
          details: productsError.details || "상세 정보 없음",
          hint: productsError.hint || "힌트 없음",
          code: productsError.code || "코드 없음",
        };
        console.error("상품 정보 조회 오류:", JSON.stringify(errorInfo, null, 2));
        throw new Error(`상품 조회 실패: ${productsError.message || errorInfo.message}`);
      }

      // 정렬된 순서대로 반환
      const productMap = new Map(products.map((p) => [p.id, p]));
      const sortedProducts = paginatedProductIds
        .map((id) => productMap.get(id))
        .filter((p): p is Product => p !== undefined);

      return sortedProducts;
    }

    // 일반 정렬 옵션 처리
    let orderColumn: string;
    let ascending: boolean;

    switch (sortBy) {
      case "price_asc":
        orderColumn = "price";
        ascending = true;
        break;
      case "price_desc":
        orderColumn = "price";
        ascending = false;
        break;
      case "latest":
      default:
        orderColumn = "created_at";
        ascending = false;
        break;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order(orderColumn, { ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      const errorInfo = {
        message: error.message || "메시지 없음",
        details: error.details || "상세 정보 없음",
        hint: error.hint || "힌트 없음",
        code: error.code || "코드 없음",
      };
      
      console.error("상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
      throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    if (error instanceof Error) {
      const errorLog = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      };
      console.error("getProductsWithPagination 오류:", JSON.stringify(errorLog, null, 2));
      throw error;
    } else {
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("getProductsWithPagination 알 수 없는 오류:", errorString);
      throw new Error("상품 조회 중 예상치 못한 오류가 발생했습니다.");
    }
  }
}

/**
 * 카테고리별 상품 목록 조회 (페이지네이션 지원)
 * @param category - 카테고리 이름
 * @param page - 페이지 번호 (1부터 시작)
 * @param limit - 페이지당 상품 수 (기본값: 12)
 * @param sortBy - 정렬 기준 (기본값: "latest")
 * @returns 상품 목록 배열
 */
export async function getProductsByCategoryWithPagination(
  category: string,
  page: number = 1,
  limit: number = 12,
  sortBy: SortOption = "latest"
): Promise<Product[]> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      
      console.error(`환경 변수 누락: ${missingVars.join(", ")}`);
      throw new Error(`환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`);
    }

    const supabase = getServiceRoleClient();
    const offset = (page - 1) * limit;

    // 인기순 정렬의 경우 별도 처리
    if (sortBy === "popular") {
      // order_items에서 product_id별 quantity 합산
      const { data: orderData, error: orderError } = await supabase
        .from("order_items")
        .select("product_id, quantity");

      if (orderError) {
        // 테이블이 없는 경우(PGRST205)는 조용히 최신순으로 대체 (개발 초기 단계)
        if (orderError.code === "PGRST205") {
          // order_items 테이블이 아직 생성되지 않음 - 최신순으로 대체
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .eq("category", category)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) {
            const errorInfo = {
              message: error.message || "메시지 없음",
              details: error.details || "상세 정보 없음",
              hint: error.hint || "힌트 없음",
              code: error.code || "코드 없음",
            };
            console.error("카테고리별 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
            throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
          }

          return (data as Product[]) || [];
        }

        // 다른 에러는 로깅 후 최신순으로 대체
        const errorInfo = {
          message: orderError.message || "메시지 없음",
          details: orderError.details || "상세 정보 없음",
          hint: orderError.hint || "힌트 없음",
          code: orderError.code || "코드 없음",
        };
        console.error("주문 데이터 조회 오류:", JSON.stringify(errorInfo, null, 2));
        // 주문 데이터 조회 실패 시 최신순으로 대체
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .eq("category", category)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          const errorInfo = {
            message: error.message || "메시지 없음",
            details: error.details || "상세 정보 없음",
            hint: error.hint || "힌트 없음",
            code: error.code || "코드 없음",
          };
          console.error("카테고리별 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
          throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
        }

        return (data as Product[]) || [];
      }

      // product_id별로 quantity 합산
      const productQuantityMap = new Map<string, number>();
      if (orderData && orderData.length > 0) {
        orderData.forEach((item) => {
          const productId = item.product_id;
          const quantity = item.quantity || 0;
          productQuantityMap.set(
            productId,
            (productQuantityMap.get(productId) || 0) + quantity
          );
        });
      }

      // 수량이 많은 순으로 정렬된 product_id 목록
      const sortedProductIds = Array.from(productQuantityMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([productId]) => productId);

      if (sortedProductIds.length === 0) {
        // 주문 데이터가 없으면 최신순으로 대체
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .eq("category", category)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          const errorInfo = {
            message: error.message || "메시지 없음",
            details: error.details || "상세 정보 없음",
            hint: error.hint || "힌트 없음",
            code: error.code || "코드 없음",
          };
          console.error("카테고리별 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
          throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
        }

        return (data as Product[]) || [];
      }

      // 인기순으로 정렬된 상품들 가져오기 (페이지네이션 적용)
      const paginatedProductIds = sortedProductIds.slice(offset, offset + limit);
      
      if (paginatedProductIds.length === 0) {
        return [];
      }

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("category", category)
        .in("id", paginatedProductIds);

      if (productsError) {
        const errorInfo = {
          message: productsError.message || "메시지 없음",
          details: productsError.details || "상세 정보 없음",
          hint: productsError.hint || "힌트 없음",
          code: productsError.code || "코드 없음",
        };
        console.error("카테고리별 상품 정보 조회 오류:", JSON.stringify(errorInfo, null, 2));
        throw new Error(`상품 조회 실패: ${productsError.message || errorInfo.message}`);
      }

      // 정렬된 순서대로 반환
      const productMap = new Map(products.map((p) => [p.id, p]));
      const sortedProducts = paginatedProductIds
        .map((id) => productMap.get(id))
        .filter((p): p is Product => p !== undefined);

      return sortedProducts;
    }

    // 일반 정렬 옵션 처리
    let orderColumn: string;
    let ascending: boolean;

    switch (sortBy) {
      case "price_asc":
        orderColumn = "price";
        ascending = true;
        break;
      case "price_desc":
        orderColumn = "price";
        ascending = false;
        break;
      case "latest":
      default:
        orderColumn = "created_at";
        ascending = false;
        break;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("category", category)
      .order(orderColumn, { ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      const errorInfo = {
        message: error.message || "메시지 없음",
        details: error.details || "상세 정보 없음",
        hint: error.hint || "힌트 없음",
        code: error.code || "코드 없음",
      };
      
      console.error("카테고리별 상품 조회 오류:", JSON.stringify(errorInfo, null, 2));
      throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    if (error instanceof Error) {
      const errorLog = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      };
      console.error("getProductsByCategoryWithPagination 오류:", JSON.stringify(errorLog, null, 2));
      throw error;
    } else {
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("getProductsByCategoryWithPagination 알 수 없는 오류:", errorString);
      throw new Error("상품 조회 중 예상치 못한 오류가 발생했습니다.");
    }
  }
}

/**
 * 전체 상품 개수 조회
 * @returns 상품 개수
 */
export async function getProductsCount(): Promise<number> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      
      console.error(`환경 변수 누락: ${missingVars.join(", ")}`);
      throw new Error(`환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`);
    }

    const supabase = getServiceRoleClient();

    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    if (error) {
      const errorInfo = {
        message: error.message || "메시지 없음",
        details: error.details || "상세 정보 없음",
        hint: error.hint || "힌트 없음",
        code: error.code || "코드 없음",
      };
      
      console.error("상품 개수 조회 오류:", JSON.stringify(errorInfo, null, 2));
      throw new Error(`상품 개수 조회 실패: ${error.message || errorInfo.message}`);
    }

    return count || 0;
  } catch (error) {
    if (error instanceof Error) {
      const errorLog = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      };
      console.error("getProductsCount 오류:", JSON.stringify(errorLog, null, 2));
      throw error;
    } else {
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("getProductsCount 알 수 없는 오류:", errorString);
      throw new Error("상품 개수 조회 중 예상치 못한 오류가 발생했습니다.");
    }
  }
}

/**
 * 카테고리별 상품 개수 조회
 * @param category - 카테고리 이름
 * @returns 상품 개수
 */
export async function getProductsCountByCategory(category: string): Promise<number> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      
      console.error(`환경 변수 누락: ${missingVars.join(", ")}`);
      throw new Error(`환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`);
    }

    const supabase = getServiceRoleClient();

    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("category", category);

    if (error) {
      const errorInfo = {
        message: error.message || "메시지 없음",
        details: error.details || "상세 정보 없음",
        hint: error.hint || "힌트 없음",
        code: error.code || "코드 없음",
      };
      
      console.error("카테고리별 상품 개수 조회 오류:", JSON.stringify(errorInfo, null, 2));
      throw new Error(`상품 개수 조회 실패: ${error.message || errorInfo.message}`);
    }

    return count || 0;
  } catch (error) {
    if (error instanceof Error) {
      const errorLog = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      };
      console.error("getProductsCountByCategory 오류:", JSON.stringify(errorLog, null, 2));
      throw error;
    } else {
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("getProductsCountByCategory 알 수 없는 오류:", errorString);
      throw new Error("상품 개수 조회 중 예상치 못한 오류가 발생했습니다.");
    }
  }
}

/**
 * 상품 상세 조회
 * @param id - 상품 ID
 * @returns 상품 정보 또는 null (상품이 없을 경우)
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      
      console.error(`환경 변수 누락: ${missingVars.join(", ")}`);
      throw new Error(`환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`);
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      // 404 에러는 null 반환 (상품이 없음)
      if (error.code === "PGRST116") {
        return null;
      }

      // 다른 에러는 로깅 후 throw
      const errorInfo = {
        message: error.message || "메시지 없음",
        details: error.details || "상세 정보 없음",
        hint: error.hint || "힌트 없음",
        code: error.code || "코드 없음",
      };
      
      console.error("상품 상세 조회 오류:", JSON.stringify(errorInfo, null, 2));
      throw new Error(`상품 조회 실패: ${error.message || errorInfo.message}`);
    }

    return (data as Product) || null;
  } catch (error) {
    // 에러 객체를 더 명확하게 로깅
    if (error instanceof Error) {
      const errorLog = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      };
      console.error("getProductById 오류:", JSON.stringify(errorLog, null, 2));
      throw error;
    } else {
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error("getProductById 알 수 없는 오류:", errorString);
      throw new Error("상품 조회 중 예상치 못한 오류가 발생했습니다.");
    }
  }
}
