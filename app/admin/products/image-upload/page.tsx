/**
 * @file app/admin/products/image-upload/page.tsx
 * @description 상품 이미지 업로드 관리 페이지
 *
 * 관리자가 Unsplash에서 이미지를 검색하고 선택하여 상품에 이미지를 추가할 수 있는 페이지입니다.
 * 
 * 기능:
 * 1. Unsplash 이미지 검색
 * 2. 이미지 선택
 * 3. 선택한 이미지를 Supabase Storage에 저장 (선택사항)
 * 4. 상품에 이미지 URL 저장
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageSelector } from "@/components/image-selector";
import { saveUnsplashImageToStorage, updateProductImage } from "@/actions/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuSave, LuLoader } from "react-icons/lu";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function ImageUploadPage() {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [saveToStorage, setSaveToStorage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // 이미지 선택 핸들러
  const handleImageSelect = (imageUrl: string, photo: any) => {
    setSelectedImageUrl(imageUrl);
    setSelectedPhoto(photo);
    setSaveResult(null);
  };

  // 이미지 저장
  const handleSave = async () => {
    if (!productId.trim()) {
      setSaveResult({
        success: false,
        message: "상품 ID를 입력해주세요.",
      });
      return;
    }

    if (!selectedImageUrl) {
      setSaveResult({
        success: false,
        message: "이미지를 선택해주세요.",
      });
      return;
    }

    try {
      setSaving(true);
      setSaveResult(null);

      let finalImageUrl = selectedImageUrl;

      // Supabase Storage에 저장할지 선택
      if (saveToStorage) {
        const result = await saveUnsplashImageToStorage(
          selectedImageUrl,
          `product-${productId}-${Date.now()}.jpg`,
          "products"
        );

        if (result.success && result.url) {
          finalImageUrl = result.url;
        } else {
          throw new Error(result.error || "이미지 저장에 실패했습니다.");
        }
      }

      // 상품에 이미지 URL 저장
      const updateResult = await updateProductImage(productId, finalImageUrl);

      if (updateResult.success) {
        setSaveResult({
          success: true,
          message: "이미지가 성공적으로 저장되었습니다!",
        });

        // 3초 후 목록으로 이동
        setTimeout(() => {
          router.push("/products");
        }, 2000);
      } else {
        throw new Error(updateResult.error || "상품 이미지 업데이트에 실패했습니다.");
      }
    } catch (err) {
      setSaveResult({
        success: false,
        message: err instanceof Error ? err.message : "저장에 실패했습니다.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">상품 이미지 업로드</h1>
        <p className="text-gray-600">
          Unsplash에서 무료 이미지를 검색하고 상품에 추가하세요.
        </p>
      </div>

      {/* 상품 ID 입력 */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Label htmlFor="product-id" className="mb-2 block">
          상품 ID
        </Label>
        <div className="flex gap-2">
          <Input
            id="product-id"
            type="text"
            placeholder="상품 UUID를 입력하세요"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSave}
            disabled={!productId || !selectedImageUrl || saving}
          >
            {saving ? (
              <>
                <LuLoader className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <LuSave className="w-4 h-4 mr-2" />
                저장
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 저장 옵션 */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={saveToStorage}
            onChange={(e) => setSaveToStorage(e.target.checked)}
            className="w-4 h-4"
          />
          <span>
            이미지를 Supabase Storage에 저장 (체크 해제 시 Unsplash URL 직접
            사용)
          </span>
        </Label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
          Storage에 저장하면 이미지가 우리 서버에 보관되어 더 안정적입니다.
        </p>
      </div>

      {/* 저장 결과 메시지 */}
      {saveResult && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            saveResult.success
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`}
        >
          {saveResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          )}
          <p
            className={`flex-1 ${
              saveResult.success
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}
          >
            {saveResult.message}
          </p>
        </div>
      )}

      {/* 선택된 이미지 미리보기 */}
      {selectedImageUrl && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">선택된 이미지</h3>
          <div className="flex gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
              <Image
                src={selectedImageUrl}
                alt="Selected image"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPhoto?.user?.name && (
                  <>작가: {selectedPhoto.user.name}</>
                )}
              </p>
              {selectedPhoto?.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 이미지 검색 및 선택 */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
        <ImageSelector
          onSelect={handleImageSelect}
          initialQuery="fashion"
          className="w-full"
        />
      </div>

      {/* 사용 안내 */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">사용 방법</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>위에서 이미지를 검색하세요 (예: fashion, clothing, shoes)</li>
          <li>원하는 이미지를 클릭하여 선택하세요</li>
          <li>상품 ID를 입력하세요 (Supabase에서 상품 ID 확인)</li>
          <li>&quot;저장&quot; 버튼을 클릭하여 이미지를 상품에 추가하세요</li>
        </ol>
      </div>
    </div>
  );
}

