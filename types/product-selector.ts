/**
 * @file types/product-selector.ts
 * @description 상품 선택 관련 TypeScript 타입 정의
 *
 * 색상 및 수량 선택 기능에서 사용되는 타입 정의입니다.
 */

/**
 * 선택한 상품 항목
 */
export interface SelectedItem {
  /** 선택한 색상 */
  color: string;
  /** 선택한 수량 */
  quantity: number;
}

/**
 * 사용 가능한 색상 목록
 */
export const AVAILABLE_COLORS = [
  "빨강",
  "파랑",
  "검정",
  "흰색",
  "회색",
  "노랑",
  "초록",
  "보라",
] as const;

/**
 * 색상 타입 (사용 가능한 색상 중 하나)
 */
export type Color = (typeof AVAILABLE_COLORS)[number];

