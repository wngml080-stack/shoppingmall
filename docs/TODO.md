# 쇼핑몰 MVP 개발 TODO

## Phase 1: 기본 인프라 (1주)

### 프로젝트 초기 설정
- [x] Next.js 프로젝트 셋업 (완료)
- [x] Supabase 프로젝트 생성 및 테이블 스키마 작성 (완료)
  - [x] `products` 테이블 생성
  - [x] `cart_items` 테이블 생성
  - [x] `orders` 테이블 생성
  - [x] `order_items` 테이블 생성
  - [x] `updated_at` 자동 갱신 함수 및 트리거 설정
  - [x] 인덱스 생성 (성능 최적화)
  - [x] RLS 비활성화
  - [x] 샘플 데이터 20개 삽입
- [x] Clerk 연동 (회원가입/로그인) - 기본 설정 완료
- [x] 기본 레이아웃 및 라우팅
  - [x] 메인 레이아웃 (`app/layout.tsx`) - ClerkProvider, SyncUserProvider 설정 완료
  - [x] 네비게이션 바 컴포넌트 (`components/Navbar.tsx`) - 기본 구조 완료
  - [x] 기본 라우트 구조 설정 - 테스트 페이지들 존재 (auth-test, db-test, storage-test)
  - [x] Clerk 인증 상태에 따른 라우트 보호 (middleware.ts) - 기본 설정 완료

### 환경 설정
- [ ] `.env` 파일 확인 및 필요한 환경 변수 추가
  - [ ] Toss Payments 테스트 키 설정
- [x] TypeScript 타입 정의
  - [x] `types/product.ts` - 상품 타입
  - [x] `types/cart.ts` - 장바구니 타입
  - [x] `types/order.ts` - 주문 타입

---

## Phase 2: 상품 기능 (1주)

### 홈페이지
- [x] `app/page.tsx` 구현
  - [x] 상품 목록 표시 (최신 상품 우선 표시)
  - [x] 카테고리 기능 (카테고리별 필터링 및 표시)
  - [x] 인기 상품 기능 (인기 상품 섹션 표시)
  - [x] 반응형 디자인 적용

### 상품 목록 페이지
- [x] `app/products/page.tsx` 구현
  - [x] 페이지 레이아웃 및 구조
    - [x] 페이지 제목 ("전체 상품" 또는 "상품 목록")
    - [x] 카테고리 필터 컴포넌트 통합 (홈페이지와 동일한 `CategoryFilter` 사용)
    - [x] 상품 목록 Grid 레이아웃 (홈페이지와 동일한 스타일)
  - [x] 상품 목록 조회 (Supabase에서 데이터 가져오기)
    - [x] URL 쿼리 파라미터에서 `category` 읽기 (Next.js 15 async searchParams)
    - [x] `getProductsWithPagination()` 또는 `getProductsByCategoryWithPagination()` 함수 사용
    - [x] 페이지네이션을 통한 상품 표시 (페이지당 12개)
  - [x] 페이지네이션 또는 무한 스크롤
    - [x] 페이지네이션 컴포넌트 구현 (`components/pagination.tsx`)
    - [x] 페이지 하단에 페이지네이션 배치
    - [x] 이전/다음 버튼 및 페이지 번호 표시
    - [x] 총 페이지 수 및 현재 범위 표시
  - [x] 로딩 상태 처리
    - [x] Suspense 사용하여 로딩 스켈레톤 표시
    - [x] 홈페이지와 동일한 스켈레톤 컴포넌트 재사용
  - [x] 에러 핸들링
    - [x] try-catch로 에러 처리
    - [x] 사용자 친화적인 에러 메시지 표시
    - [x] 홈페이지와 동일한 에러 UI 재사용
  - [x] 빈 상태 처리
    - [x] 카테고리 필터링 시 해당 카테고리 상품이 없을 때 메시지 표시
    - [x] 전체 상품이 없을 때 메시지 표시
- [x] 상품 카드 컴포넌트 (`components/product-card.tsx`)
  - [x] 상품 이미지 표시
  - [x] 상품명, 가격, 카테고리 표시
  - [x] 장바구니 추가 버튼 (상품 상세 페이지에서 구현 완료)

### 카테고리 필터링
- [x] 카테고리 필터 컴포넌트 (`components/category-filter.tsx`)
  - [x] 전체 카테고리 목록 표시
  - [x] 카테고리별 상품 필터링 기능
  - [x] URL 쿼리 파라미터와 동기화

### 상품 상세 페이지
- [x] `app/products/[id]/page.tsx` 레이아웃 수정 (2열 구조)
  - [x] 상품 상세 정보 조회
  - [x] 404 처리 (상품이 없을 경우)
  - [x] 2열 레이아웃 구조 구현
    - [x] 왼쪽 열: 제품 이미지
      - [x] 상품 이미지 표시
      - [x] 이미지 비율 및 크기 최적화 (aspect-square 적용)
    - [x] 오른쪽 열: 상품 정보 (순서대로 배치)
      - [x] 제품 이름 (큰 제목 스타일)
      - [x] 가격 (천 단위 콤마 포맷팅)
      - [x] 재고 표시 (품절/재고있음/남은수량)
      - [x] 카테고리 태그
      - [x] 상품 설명 (줄바꿈 지원)
      - [x] 등록일 표시 (한국어 날짜 포맷)
      - [x] 수정일 표시 (등록일과 다를 경우만 표시)
    - [x] 장바구니 UI (Phase 3에서 기능 구현)
      - [x] 수량 선택 UI (Phase 3에서 구현)
      - [x] 장바구니 추가 버튼 (UI 및 기능 완료)
      - [x] 품절 상태 처리 (재고 0일 때 버튼 비활성화)
  - [x] 반응형 디자인 적용
    - [x] 모바일: 세로 레이아웃 (grid-cols-1 적용)
    - [x] 데스크톱: 2열 레이아웃 (grid-cols-2 적용)
  - [x] 로딩 상태 처리
    - [x] Suspense 사용하여 로딩 스켈레톤 표시
    - [x] ProductDetailSkeleton 컴포넌트 구현 (2열 레이아웃 구조 반영)
  - [x] 에러 핸들링
    - [x] try-catch로 에러 처리
    - [x] 사용자 친화적인 에러 메시지 표시
    - [x] 상품 목록 페이지와 동일한 에러 UI 스타일
  - [x] 빈 상태 처리
    - [x] 상품이 없을 경우 404 페이지 표시 (notFound() 유지)
  - [ ] 상품 이미지 갤러리 (추가 개선사항, MVP 이후)
    - [ ] 여러 이미지 지원
    - [ ] 이미지 슬라이더/캐러셀

### 상품 관련 Server Actions
- [x] `actions/products.ts` 생성
  - [x] `getProducts()` - 상품 목록 조회
  - [x] `getProductById(id)` - 상품 상세 조회
  - [x] `getProductsByCategory(category)` - 카테고리별 조회
  - [x] `getPopularProducts(limit)` - 인기 상품 조회
  - [x] `getProductsWithPagination(page, limit, sortBy)` - 페이지네이션 및 정렬 지원 상품 목록 조회
  - [x] `getProductsByCategoryWithPagination(category, page, limit, sortBy)` - 카테고리별 페이지네이션 및 정렬 지원
  - [x] `getProductsCount()` - 전체 상품 개수 조회
  - [x] `getProductsCountByCategory(category)` - 카테고리별 상품 개수 조회
- [x] 상품 정렬 기능 (`components/sort-filter.tsx`)
  - [x] 최신순 정렬
  - [x] 가격 낮은순 정렬
  - [x] 가격 높은순 정렬
  - [x] 인기순 정렬
  - [x] URL 쿼리 파라미터와 동기화
- [x] 상품 이미지 기능
  - [x] `products` 테이블에 `image_url` 컬럼 추가
  - [x] 상품 이미지 표시 기능
  - [x] `actions/images.ts` - 이미지 관련 Server Actions
    - [x] `saveUnsplashImageToStorage()` - Unsplash 이미지를 Supabase Storage에 저장
    - [x] `updateProductImage()` - 상품 이미지 URL 업데이트
  - [x] 어드민 이미지 업로드 페이지 (`app/admin/products/image-upload/page.tsx`)

### 어드민 상품 등록
- [ ] 주의: MVP에서는 Supabase 대시보드에서 직접 등록
- [ ] 상품 등록 가이드 문서 작성 (`docs/admin-product-guide.md`)

---

## Phase 3: 장바구니 & 주문 (1주)

### 장바구니 기능
- [x] 장바구니 페이지 (`app/cart/page.tsx`)
  - [x] 현재 사용자의 장바구니 조회 (clerk_id로 필터링)
  - [x] 장바구니 아이템 목록 표시
  - [x] 수량 변경 기능
  - [x] 아이템 삭제 기능
  - [x] 총 금액 계산 및 표시
  - [x] 빈 장바구니 상태 UI
- [x] 장바구니 아이템 컴포넌트 (`components/cart-item.tsx`)
  - [x] 상품 정보 표시
  - [x] 수량 조절 UI (+/- 버튼)
  - [x] 삭제 버튼
  - [x] 개별 아이템 가격 표시
- [x] 장바구니 관련 Server Actions (`actions/cart.ts`)
  - [x] `getCartItems(clerkId)` - 장바구니 조회 (상품 정보 포함)
  - [x] `getCartItemCount(clerkId)` - 장바구니 아이템 개수 조회 (배지용)
  - [x] `addToCart(clerkId, items)` - 장바구니 추가 (여러 아이템 일괄 처리, 재고 확인, 중복 아이템 수량 합치기)
  - [x] `updateCartItemQuantity(cartItemId, quantity)` - 수량 변경 (재고 확인 포함)
  - [x] `removeCartItem(cartItemId)` - 아이템 삭제
  - [x] `clearCart(clerkId)` - 장바구니 비우기
- [x] 장바구니 아이콘 및 배지 (`components/cart-icon.tsx`)
  - [x] 헤더에 장바구니 아이콘 추가
  - [x] 장바구니 아이템 개수 표시 (배지)
- [x] 장바구니 추가 기능 컴포넌트
  - [x] 장바구니 추가 버튼 (`components/add-to-cart-button.tsx`)
  - [x] 장바구니 추가 다이얼로그 (`components/add-to-cart-dialog.tsx`)
  - [x] 상품 선택기 (`components/product-selector.tsx`) - 색상 및 수량 선택
- [x] 장바구니 유틸리티
  - [x] 장바구니 총액 계산 함수 (`lib/cart-utils.ts`)
- [x] 장바구니 클라이언트 컴포넌트
  - [x] 장바구니 내용 클라이언트 컴포넌트 (`app/cart/cart-content-client.tsx`)
- [x] 데이터베이스 마이그레이션
  - [x] `cart_items` 테이블 생성 (color 컬럼 포함)
  - [x] `update_updated_at_column()` 함수 생성

### 주문 프로세스
- [x] 주문 페이지 (`app/checkout/page.tsx`)
  - [x] 주문서 작성 폼 (`components/checkout-form.tsx`)
    - [x] 배송지 정보 입력 (이름, 주소, 연락처, 우편번호)
    - [x] 주문 요청사항 입력
  - [x] 주문 상품 목록 표시
  - [x] 총 주문 금액 계산 및 표시
  - [x] 유효성 검사 (react-hook-form + Zod)
  - [x] 로딩 상태 처리
  - [x] 에러 핸들링
  - [x] 빈 장바구니 처리
- [x] 주문 완료 페이지 (`app/checkout/success/page.tsx`)
  - [x] 주문 성공 메시지 표시
  - [x] 주문 번호 표시
  - [x] 주문 정보 표시 (주문 일시, 상태, 총 금액)
  - [x] 주문 내역 보기 링크
  - [x] 쇼핑 계속하기 링크
  - [x] 로딩 상태 처리 (Suspense)
  - [x] 에러 핸들링
- [x] 주문 관련 Server Actions (`actions/orders.ts`)
  - [x] `createOrder(clerkId, orderData)` - 주문 생성
  - [x] `getOrders(clerkId)` - 주문 내역 조회
  - [x] `getOrderById(orderId, clerkId)` - 주문 상세 조회
- [x] 주문 생성 로직
  - [x] 장바구니 아이템을 주문 아이템으로 변환
  - [x] 재고 확인 및 유효성 검사
  - [x] 주문 테이블에 주문 정보 저장
  - [x] 주문 상세 테이블에 아이템 저장
  - [x] 장바구니 비우기
  - [x] 에러 시 롤백 처리

---

## Phase 4: 결제 통합 (1주)

### Toss Payments 설정
- [ ] Toss Payments 테스트 계정 설정
- [ ] 환경 변수 설정
  - [ ] `NEXT_PUBLIC_TOSS_CLIENT_KEY` (테스트 키)
  - [ ] `TOSS_SECRET_KEY` (테스트 키)
- [ ] Toss Payments SDK 설치 및 설정

### 결제 페이지
- [ ] 결제 페이지 (`app/payment/page.tsx`)
  - [ ] 주문 정보 확인
  - [ ] Toss Payments 결제 위젯 연동
  - [ ] 결제 진행 상태 표시
  - [ ] 결제 완료 후 리다이렉트 처리
- [ ] 결제 API 라우트 (`app/api/payment/route.ts`)
  - [ ] 결제 승인 요청 처리
  - [ ] 결제 검증 로직
  - [ ] 결제 완료 후 주문 상태 업데이트
  - [ ] 에러 핸들링

### 결제 완료 처리
- [ ] 결제 완료 페이지 (`app/payment/success/page.tsx`)
  - [ ] 결제 성공 메시지
  - [ ] 주문 번호 표시
  - [ ] 주문 상세 보기 링크
- [ ] 결제 실패 페이지 (`app/payment/fail/page.tsx`)
  - [ ] 실패 메시지 표시
  - [ ] 다시 시도 버튼
- [ ] 결제 완료 후 주문 저장 로직
  - [ ] 주문 상태를 'confirmed'로 업데이트
  - [ ] 결제 정보 저장 (필요시)

---

## Phase 5: 마이페이지 (0.5주)

### 마이페이지 레이아웃
- [ ] 마이페이지 (`app/mypage/page.tsx`)
  - [ ] 사용자 정보 표시 (Clerk에서 가져오기)
  - [ ] 주문 내역 링크
  - [ ] 로그아웃 버튼

### 주문 내역
- [ ] 주문 내역 페이지 (`app/mypage/orders/page.tsx`)
  - [ ] 주문 목록 조회 (최신순 정렬)
  - [ ] 주문 상태별 필터링
  - [ ] 주문 카드 컴포넌트 (`components/order-card.tsx`)
    - [ ] 주문 번호, 날짜, 상태 표시
    - [ ] 주문 상품 요약 (이미지, 이름, 수량)
    - [ ] 총 금액 표시
    - [ ] 주문 상세 보기 링크

### 주문 상세
- [ ] 주문 상세 페이지 (`app/mypage/orders/[id]/page.tsx`)
  - [ ] 주문 상세 정보 조회
  - [ ] 주문 상태 표시
  - [ ] 주문 상품 목록 (상세)
  - [ ] 배송지 정보 표시
  - [ ] 주문 요청사항 표시
  - [ ] 주문 취소 기능 (옵션)

---

## Phase 6: 테스트 & 배포 (0.5주)

### 기능 테스트
- [ ] 전체 사용자 플로우 테스트
  - [ ] 회원가입/로그인
  - [ ] 상품 목록 조회
  - [ ] 상품 상세 보기
  - [ ] 장바구니 추가/수정/삭제
  - [ ] 주문 생성
  - [ ] 결제 진행
  - [ ] 주문 내역 조회
- [ ] 에러 케이스 테스트
  - [ ] 로그인하지 않은 사용자 접근
  - [ ] 존재하지 않는 상품 접근
  - [ ] 재고 부족 시 장바구니 추가
  - [ ] 결제 실패 처리
- [ ] 반응형 디자인 테스트
  - [ ] 모바일 (320px ~ 768px)
  - [ ] 태블릿 (768px ~ 1024px)
  - [ ] 데스크톱 (1024px 이상)

### 코드 품질
- [ ] ESLint 오류 수정
- [ ] TypeScript 타입 오류 수정
- [ ] 불필요한 console.log 제거
- [ ] 코드 주석 정리

### 성능 최적화
- [x] 이미지 최적화 (Next.js Image 컴포넌트 사용)
- [ ] 데이터 페칭 최적화 (React Query 캐싱)
- [ ] 번들 크기 확인 및 최적화

### 배포 준비
- [x] 환경 변수 설정 (Vercel)
- [x] Supabase 프로덕션 환경 확인
- [x] Clerk 프로덕션 환경 확인
- [ ] Toss Payments 테스트 모드 확인
- [x] Vercel 배포
- [x] 배포 환경 동적 라우트 설정 (`export const dynamic = 'force-dynamic'`)
- [ ] 배포 후 전체 플로우 재테스트

### 문서화
- [x] README.md 업데이트
  - [x] 프로젝트 개요
  - [x] 설치 및 실행 방법
  - [x] 환경 변수 설정 가이드
  - [x] 주요 기능 설명
- [x] 배포 가이드 작성 (`docs/deployment-guide.md`)
- [x] Vercel 배포 체크리스트 작성 (`docs/vercel-deployment-checklist.md`)
- [x] 트러블슈팅 가이드 작성 (`docs/troubleshooting.md`)

---

## 추가 개선사항 (MVP 이후)

### UI/UX 개선
- [x] 로딩 스켈레톤 추가 (상품 목록 페이지, 상품 상세 페이지)
- [x] 푸터 컴포넌트 구현 (Fit kong 쇼핑몰 정보, 소셜 미디어 아이콘, 네비게이션 링크, 사업자 정보)
- [x] Navbar 메뉴 추가 (상품, 베스트 상품 메뉴)
- [ ] 에러 바운더리 구현 (전역 에러 처리)
- [ ] 토스트 메시지 (성공/실패 알림)
- [ ] 다크모드 지원

### 기능 개선
- [ ] 상품 검색 기능
- [x] 상품 정렬 기능 (가격순, 인기순, 최신순)
- [x] 상품 이미지 업로드 (Supabase Storage + Unsplash)
- [ ] 주문 상태 변경 알림

### 성능 개선
- [ ] 이미지 CDN 연동
- [ ] 서버 사이드 캐싱
- [ ] 데이터베이스 쿼리 최적화

---

## 완료된 작업

- [x] Supabase 데이터베이스 스키마 설계 및 생성
- [x] 샘플 데이터 20개 삽입
- [x] RLS 비활성화 설정
- [x] 홈페이지 상품 목록 표시 기능
- [x] 카테고리 필터링 기능 구현
- [x] 인기 상품 섹션 기능 구현
- [x] 상품 목록 페이지 구현 (페이지네이션 포함)
- [x] 페이지네이션 컴포넌트 구현
- [x] 상품 카드 컴포넌트 구현
- [x] 상품 상세 페이지 구현
  - [x] 2열 레이아웃 구조 (왼쪽: 이미지, 오른쪽: 상품 정보)
  - [x] 상품 정보 순서 재배치 (이름 → 가격 → 재고 → 카테고리 → 설명 → 등록일)
  - [x] 로딩 상태 처리 (Suspense + ProductDetailSkeleton)
  - [x] 에러 핸들링 (try-catch + 사용자 친화적 에러 UI)
  - [x] 빈 상태 처리 (404 페이지)
  - [x] 배포 환경 동적 라우트 설정 (`export const dynamic = 'force-dynamic'`)
- [x] 상품 관련 Server Actions 구현 (getProducts, getProductById, getProductsByCategory, getPopularProducts, getProductsWithPagination, getProductsByCategoryWithPagination, getProductsCount, getProductsCountByCategory)
- [x] TypeScript 상품 타입 정의
- [x] 상품 정렬 기능 구현
  - [x] 정렬 필터 컴포넌트 (`components/sort-filter.tsx`)
  - [x] 최신순, 가격순(낮은순/높은순), 인기순 정렬
  - [x] URL 쿼리 파라미터 연동
- [x] 상품 이미지 기능 구현
  - [x] `products` 테이블에 `image_url` 컬럼 추가 (마이그레이션)
  - [x] 상품 이미지 표시 기능
  - [x] 이미지 관련 Server Actions (`actions/images.ts`)
  - [x] 어드민 이미지 업로드 페이지 (`app/admin/products/image-upload/page.tsx`)
- [x] 장바구니 기능 구현 완료
  - [x] 장바구니 페이지 구현
  - [x] 장바구니 아이템 컴포넌트 구현
  - [x] 장바구니 Server Actions 구현
  - [x] 장바구니 추가/수정/삭제 기능 구현
  - [x] 장바구니 아이콘 및 배지 구현
  - [x] 상품 상세 페이지에서 장바구니 추가 기능 구현
  - [x] 장바구니 타입 정의 (`types/cart.ts`)
  - [x] `cart_items` 테이블 생성 및 마이그레이션 완료
- [x] 주문 기능 구현 완료
  - [x] 주문 페이지 (`app/checkout/page.tsx`)
  - [x] 주문 폼 컴포넌트 (`components/checkout-form.tsx`)
  - [x] 주문 완료 페이지 (`app/checkout/success/page.tsx`)
  - [x] 주문 관련 Server Actions (`actions/orders.ts`)
    - [x] `createOrder()` - 주문 생성
    - [x] `getOrders()` - 주문 내역 조회
    - [x] `getOrderById()` - 주문 상세 조회
  - [x] 주문 생성 로직 (재고 확인, 장바구니 비우기, 에러 롤백)
  - [x] 주문 타입 정의 (`types/order.ts`)
- [x] 배포 설정
  - [x] Vercel 배포 완료
  - [x] 배포 환경 동적 라우트 설정
  - [x] 배포 문서 작성
- [x] 푸터 및 네비게이션 메뉴 구현
  - [x] Footer 컴포넌트 생성 (`components/Footer.tsx`)
    - [x] 파란색 배경 스타일
    - [x] 소셜 미디어 아이콘 (인스타그램, 웹, 카카오톡)
    - [x] 네비게이션 링크 (홈, 상품, 장바구니, 마이페이지)
    - [x] 사업자 정보 표시 (Fit kong, 김소연, 서울특별시 강남구, 000-00-000000)
    - [x] 저작권 정보
  - [x] Navbar 메뉴 추가 (`components/Navbar.tsx`)
    - [x] 상품 메뉴 (`/products` 링크)
    - [x] 베스트 상품 메뉴 (`/products?sort=popular` 링크)
    - [x] 로고 텍스트 변경 (Fit kong)
  - [x] RootLayout에 Footer 추가 (`app/layout.tsx`)
    - [x] 모든 페이지 하단에 표시되도록 구성
