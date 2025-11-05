-- products 테이블에 image_url 필드 추가
-- Unsplash나 다른 이미지 서비스의 URL을 저장하기 위한 필드

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 이미지 URL에 대한 인덱스 생성 (선택사항, 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_products_image_url ON public.products(image_url) 
WHERE image_url IS NOT NULL;

-- 기존 상품들의 이미지 URL을 NULL로 설정 (기본값)
-- 나중에 각 상품에 이미지를 추가할 수 있습니다

