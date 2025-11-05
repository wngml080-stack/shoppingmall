-- ==========================================
-- cart_items 테이블에 color 컬럼 추가
-- 파일명: 20251105192352_add_color_to_cart_items.sql
-- ==========================================

-- 1. color 컬럼 추가 (NULL 허용, 색상 선택 옵션용)
ALTER TABLE public.cart_items 
ADD COLUMN IF NOT EXISTS color TEXT;

-- 2. 기존 UNIQUE 제약 조건 삭제 (clerk_id, product_id만으로는 충분하지 않음)
-- 같은 상품이라도 다른 색상은 다른 아이템이므로
ALTER TABLE public.cart_items 
DROP CONSTRAINT IF EXISTS cart_items_clerk_id_product_id_key;

-- 3. 새로운 UNIQUE 제약 조건 추가 (clerk_id, product_id, color 조합)
-- 같은 상품, 같은 색상은 하나만 존재 가능
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique 
ON public.cart_items(clerk_id, product_id, COALESCE(color, ''));

-- 4. color 컬럼 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_cart_items_color 
ON public.cart_items(color);

