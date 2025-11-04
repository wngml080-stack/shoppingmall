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
