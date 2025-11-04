/**
 * @file types/product.ts
 * @description 상품 관련 TypeScript 타입 정의
 *
 * Supabase products 테이블의 스키마를 기반으로 한 타입 정의입니다.
 */

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
