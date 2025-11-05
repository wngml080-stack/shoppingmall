/**
 * @file actions/images.ts
 * @description 이미지 관련 Server Actions
 *
 * Unsplash 이미지를 Supabase Storage에 저장하는 기능을 제공합니다.
 * 선택한 이미지를 다운로드하여 Storage에 저장하고, 공개 URL을 반환합니다.
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Unsplash 이미지 URL을 Supabase Storage에 저장
 * @param imageUrl Unsplash 이미지 URL
 * @param fileName 저장할 파일명 (선택사항)
 * @param folder 저장할 폴더 (선택사항, 기본값: 'products')
 * @returns 저장된 이미지의 공개 URL
 */
export async function saveUnsplashImageToStorage(
  imageUrl: string,
  fileName?: string,
  folder: string = "products"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // 1. 이미지 다운로드
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`이미지 다운로드 실패: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Blob([imageBuffer]);

    // 2. 파일명 생성 (없으면 타임스탬프 기반)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const finalFileName =
      fileName || `unsplash-${timestamp}-${randomString}.jpg`;

    // 3. Storage 경로 생성
    const filePath = `${folder}/${finalFileName}`;

    // 4. Service Role 클라이언트로 Storage에 업로드 (RLS 우회)
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, imageBlob, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // 5. 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (err) {
    console.error("이미지 저장 오류:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "이미지 저장에 실패했습니다.",
    };
  }
}

/**
 * 상품 이미지 URL을 데이터베이스에 저장
 * @param productId 상품 ID
 * @param imageUrl 이미지 URL (Unsplash URL 또는 Storage URL)
 * @returns 성공 여부
 */
export async function updateProductImage(
  productId: string,
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getServiceRoleClient();

    const { error } = await supabase
      .from("products")
      .update({ image_url: imageUrl })
      .eq("id", productId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error("상품 이미지 업데이트 오류:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "상품 이미지 업데이트에 실패했습니다.",
    };
  }
}

