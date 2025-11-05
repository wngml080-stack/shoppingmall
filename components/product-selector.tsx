/**
 * @file components/product-selector.tsx
 * @description 상품 색상 및 수량 선택 컴포넌트
 *
 * 사용자가 상품의 색상과 수량을 선택하고, 선택한 항목들을 카드 형태로 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 색상 선택 (하드코딩된 색상 목록)
 * 2. 수량 선택 (1부터 재고 수량까지)
 * 3. 선택한 항목 목록 표시 (카드 형태)
 * 4. 항목 삭제 기능
 *
 * @dependencies
 * - react: useState 훅 사용
 * - lucide-react: X 아이콘
 * - @/components/ui/button: Button 컴포넌트
 * - @/components/ui/select: Select 컴포넌트
 * - @/types/product-selector: SelectedItem, AVAILABLE_COLORS 타입
 */

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectedItem } from "@/types/product-selector";
import { AVAILABLE_COLORS } from "@/types/product-selector";

interface ProductSelectorProps {
  /** 재고 수량 (수량 선택의 최대값) */
  stockQuantity: number;
}

/**
 * 상품 색상 및 수량 선택 컴포넌트
 */
export function ProductSelector({ stockQuantity }: ProductSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  // 재고가 없으면 컴포넌트 비활성화
  const isDisabled = stockQuantity === 0;

  // 수량 옵션 생성 (1부터 재고 수량까지)
  const quantityOptions = Array.from(
    { length: stockQuantity },
    (_, i) => i + 1
  );

  /**
   * 선택한 항목을 목록에 추가
   */
  const handleAddItem = () => {
    if (!selectedColor || selectedQuantity <= 0) {
      return;
    }

    // 새 항목 추가
    const newItem: SelectedItem = {
      color: selectedColor,
      quantity: selectedQuantity,
    };

    setSelectedItems([...selectedItems, newItem]);

    // 입력 필드 초기화
    setSelectedColor("");
    setSelectedQuantity(1);
  };

  /**
   * 선택한 항목 삭제
   */
  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 선택 영역 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          옵션 선택
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* 색상 선택 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              색상
            </label>
            <Select
              value={selectedColor}
              onValueChange={setSelectedColor}
              disabled={isDisabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="색상을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_COLORS.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 수량 선택 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              수량
            </label>
            <Select
              value={selectedQuantity.toString()}
              onValueChange={(value) => setSelectedQuantity(Number(value))}
              disabled={isDisabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="수량을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {quantityOptions.map((quantity) => (
                  <SelectItem key={quantity} value={quantity.toString()}>
                    {quantity}개
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 추가 버튼 */}
          <div className="flex items-end">
            <Button
              onClick={handleAddItem}
              disabled={isDisabled || !selectedColor || selectedQuantity <= 0}
              className="w-full sm:w-auto"
            >
              추가
            </Button>
          </div>
        </div>
      </div>

      {/* 선택한 항목 목록 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          선택한 항목
        </h3>

        {selectedItems.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            선택한 항목이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.color}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.quantity}개
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  className="h-8 w-8 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

