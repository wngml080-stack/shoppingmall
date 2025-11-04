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
- [ ] TypeScript 타입 정의
  - [ ] `types/product.ts` - 상품 타입
  - [ ] `types/cart.ts` - 장바구니 타입
  - [ ] `types/order.ts` - 주문 타입

---

## Phase 2: 상품 기능 (1주)

### 홈페이지
- [ ] `app/page.tsx` 구현
  - [ ] 상품 목록 표시 (최신 상품 우선 표시)
  - [ ] 카테고리 기능 (카테고리별 필터링 및 표시)
  - [ ] 인기 상품 기능 (인기 상품 섹션 표시)
  - [ ] 반응형 디자인 적용

### 상품 목록 페이지
- [ ] `app/products/page.tsx` 구현
  - [ ] 상품 목록 조회 (Supabase에서 데이터 가져오기)
  - [ ] 페이지네이션 또는 무한 스크롤
  - [ ] 로딩 상태 처리
  - [ ] 에러 핸들링
- [ ] 상품 카드 컴포넌트 (`components/product-card.tsx`)
  - [ ] 상품 이미지 표시
  - [ ] 상품명, 가격, 카테고리 표시
  - [ ] 장바구니 추가 버튼 (Phase 3에서 구현)

### 카테고리 필터링
- [ ] 카테고리 필터 컴포넌트 (`components/category-filter.tsx`)
  - [ ] 전체 카테고리 목록 표시
  - [ ] 카테고리별 상품 필터링 기능
  - [ ] URL 쿼리 파라미터와 동기화

### 상품 상세 페이지
- [ ] `app/products/[id]/page.tsx` 구현
  - [ ] 상품 상세 정보 조회
  - [ ] 상품 이미지 갤러리 (여러 이미지 지원)
  - [ ] 상품 설명 표시
  - [ ] 가격, 재고 수량 표시
  - [ ] 수량 선택 UI
  - [ ] 장바구니 추가 버튼 (Phase 3에서 구현)
  - [ ] 404 처리 (상품이 없을 경우)

### 상품 관련 Server Actions
- [ ] `actions/products.ts` 생성
  - [ ] `getProducts()` - 상품 목록 조회
  - [ ] `getProductById(id)` - 상품 상세 조회
  - [ ] `getProductsByCategory(category)` - 카테고리별 조회

### 어드민 상품 등록
- [ ] 주의: MVP에서는 Supabase 대시보드에서 직접 등록
- [ ] 상품 등록 가이드 문서 작성 (`docs/admin-product-guide.md`)

---

## Phase 3: 장바구니 & 주문 (1주)

### 장바구니 기능
- [ ] 장바구니 페이지 (`app/cart/page.tsx`)
  - [ ] 현재 사용자의 장바구니 조회 (clerk_id로 필터링)
  - [ ] 장바구니 아이템 목록 표시
  - [ ] 수량 변경 기능
  - [ ] 아이템 삭제 기능
  - [ ] 총 금액 계산 및 표시
  - [ ] 빈 장바구니 상태 UI
- [ ] 장바구니 아이템 컴포넌트 (`components/cart-item.tsx`)
  - [ ] 상품 정보 표시
  - [ ] 수량 조절 UI (+/- 버튼)
  - [ ] 삭제 버튼
  - [ ] 개별 아이템 가격 표시
- [ ] 장바구니 관련 Server Actions (`actions/cart.ts`)
  - [ ] `getCartItems(clerkId)` - 장바구니 조회
  - [ ] `addToCart(clerkId, productId, quantity)` - 장바구니 추가
  - [ ] `updateCartItem(cartItemId, quantity)` - 수량 변경
  - [ ] `removeCartItem(cartItemId)` - 아이템 삭제
  - [ ] `clearCart(clerkId)` - 장바구니 비우기
- [ ] 장바구니 아이콘 및 배지 (`components/cart-icon.tsx`)
  - [ ] 헤더에 장바구니 아이콘 추가
  - [ ] 장바구니 아이템 개수 표시 (배지)

### 주문 프로세스
- [ ] 주문 페이지 (`app/checkout/page.tsx`)
  - [ ] 주문서 작성 폼
    - [ ] 배송지 정보 입력 (이름, 주소, 연락처)
    - [ ] 주문 요청사항 입력
  - [ ] 주문 상품 목록 표시
  - [ ] 총 주문 금액 계산 및 표시
  - [ ] 유효성 검사 (react-hook-form + Zod)
  - [ ] 로딩 상태 처리
- [ ] 주문 관련 Server Actions (`actions/orders.ts`)
  - [ ] `createOrder(orderData)` - 주문 생성
  - [ ] `getOrders(clerkId)` - 주문 내역 조회
  - [ ] `getOrderById(orderId, clerkId)` - 주문 상세 조회
- [ ] 주문 생성 로직
  - [ ] 장바구니 아이템을 주문 아이템으로 변환
  - [ ] 주문 테이블에 주문 정보 저장
  - [ ] 주문 상세 테이블에 아이템 저장
  - [ ] 장바구니 비우기
  - [ ] 재고 수량 차감 (옵션)

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
- [ ] 이미지 최적화 (Next.js Image 컴포넌트 사용)
- [ ] 데이터 페칭 최적화 (React Query 캐싱)
- [ ] 번들 크기 확인 및 최적화

### 배포 준비
- [ ] 환경 변수 설정 (Vercel)
- [ ] Supabase 프로덕션 환경 확인
- [ ] Clerk 프로덕션 환경 확인
- [ ] Toss Payments 테스트 모드 확인
- [ ] Vercel 배포
- [ ] 배포 후 전체 플로우 재테스트

### 문서화
- [ ] README.md 업데이트
  - [ ] 프로젝트 개요
  - [ ] 설치 및 실행 방법
  - [ ] 환경 변수 설정 가이드
  - [ ] 주요 기능 설명
- [ ] 배포 가이드 작성 (`docs/deployment-guide.md`)

---

## 추가 개선사항 (MVP 이후)

### UI/UX 개선
- [ ] 로딩 스켈레톤 추가
- [ ] 에러 바운더리 구현
- [ ] 토스트 메시지 (성공/실패 알림)
- [ ] 다크모드 지원

### 기능 개선
- [ ] 상품 검색 기능
- [ ] 상품 정렬 기능 (가격순, 인기순)
- [ ] 상품 이미지 업로드 (Supabase Storage)
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
