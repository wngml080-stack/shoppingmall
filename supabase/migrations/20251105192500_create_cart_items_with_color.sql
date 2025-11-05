-- ==========================================
-- cart_items 테이블 생성 (color 컬럼 포함)
-- 파일명: 20251105192500_create_cart_items_with_color.sql
-- ==========================================

-- 1. cart_items 테이블 생성 (color 컬럼 포함)
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    color TEXT, -- 색상 정보 (선택사항)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 기존 UNIQUE 제약 조건이 있다면 삭제
ALTER TABLE public.cart_items 
DROP CONSTRAINT IF EXISTS cart_items_clerk_id_product_id_key;

-- 3. 새로운 UNIQUE 제약 조건 추가 (clerk_id, product_id, color 조합)
-- 같은 상품, 같은 색상은 하나만 존재 가능
-- color가 NULL인 경우도 고려하여 COALESCE 사용
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique 
ON public.cart_items(clerk_id, product_id, COALESCE(color, ''));

-- 4. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_cart_items_clerk_id ON cart_items(clerk_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_color ON cart_items(color);

-- 5. updated_at 자동 갱신 트리거
CREATE TRIGGER set_updated_at_cart_items
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS 비활성화
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- 7. 권한 부여
GRANT ALL ON TABLE public.cart_items TO anon, authenticated, service_role;

