# Vercel 배포 가이드

이 문서는 쇼핑몰 MVP를 Vercel에 배포하는 방법을 안내합니다.

## 사전 준비

### 1. Vercel 계정 생성

1. https://vercel.com 접속
2. GitHub 계정으로 로그인 (또는 이메일로 가입)
3. 계정 생성 완료

### 2. GitHub 저장소 연결

프로젝트를 GitHub에 푸시해야 합니다:

```bash
# Git 저장소 초기화 (아직 안 했다면)
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: 쇼핑몰 MVP"

# GitHub 저장소 생성 후 연결
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

---

## Vercel 배포 단계

### 방법 1: Vercel Dashboard에서 배포 (권장)

1. **Vercel Dashboard 접속**
   - https://vercel.com/dashboard 접속
   - "Add New..." → "Project" 클릭

2. **GitHub 저장소 선택**
   - GitHub 저장소 목록에서 프로젝트 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `pnpm run build` (자동 설정됨)
   - **Output Directory**: `.next` (자동 설정됨)
   - **Install Command**: `pnpm install` (자동 설정됨)

4. **환경 변수 설정** (중요!)
   - "Environment Variables" 섹션 클릭
   - 아래 환경 변수들을 추가:

   #### Clerk 환경 변수
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
   ```

   #### Supabase 환경 변수
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_STORAGE_BUCKET=uploads
   ```

   #### Unsplash 환경 변수 (선택사항 - 이미지 기능 사용 시)
   ```
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
   ```

   **주의사항:**
   - 각 환경 변수는 "Production", "Preview", "Development" 모두에 추가
   - 또는 "Add" 버튼 옆의 드롭다운에서 "All Environments" 선택

5. **배포 실행**
   - "Deploy" 버튼 클릭
   - 빌드 진행 상황 확인 (약 2-3분 소요)

6. **배포 완료 확인**
   - "Congratulations!" 메시지 확인
   - 배포된 URL 확인 (예: `https://your-project.vercel.app`)

---

### 방법 2: Vercel CLI 사용

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   # 또는
   pnpm add -g vercel
   ```

2. **로그인**
   ```bash
   vercel login
   ```

3. **배포**
   ```bash
   vercel
   ```
   - 프로젝트 설정 질문에 답변
   - 환경 변수는 Vercel Dashboard에서 추가해야 함

---

## 배포 후 확인 사항

### 1. 환경 변수 확인

Vercel Dashboard → Settings → Environment Variables에서 모든 환경 변수가 설정되어 있는지 확인

### 2. Clerk 프로덕션 설정

1. Clerk Dashboard → Settings → Domains
2. Vercel 배포 URL 추가 (예: `your-project.vercel.app`)
3. Redirect URLs 설정 확인

### 3. 기능 테스트

배포된 사이트에서 다음 기능 테스트:

- [ ] 홈페이지 로드
- [ ] 상품 목록 표시
- [ ] 로그인/회원가입
- [ ] 상품 상세 페이지 (Phase 2에서 구현 예정)

---

## 문제 해결

### 빌드 실패

**원인**: 환경 변수 누락 또는 빌드 오류

**해결**:
1. Vercel Dashboard → Deployments → 실패한 배포 클릭
2. 빌드 로그 확인
3. 환경 변수 누락 확인
4. 로컬에서 `pnpm run build` 실행하여 오류 확인

### 환경 변수 오류

**원인**: 환경 변수가 제대로 설정되지 않음

**해결**:
1. Vercel Dashboard → Settings → Environment Variables
2. 모든 환경 변수 확인
3. Production, Preview, Development 모두에 설정되어 있는지 확인
4. 재배포 실행

### 이미지 로드 실패

**원인**: `next.config.ts`의 이미지 도메인 설정 누락

**해결**:
- `next.config.ts`에 외부 이미지 도메인 추가
- 이미 추가되어 있음 (placehold.co, images.unsplash.com, plus.unsplash.com)

---

## 배포 업데이트

코드를 수정한 후:

1. **Git에 푸시**
   ```bash
   git add .
   git commit -m "업데이트 내용"
   git push
   ```

2. **자동 배포**
   - Vercel이 자동으로 감지하여 재배포
   - Vercel Dashboard에서 배포 진행 상황 확인

---

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Clerk 배포 가이드](https://clerk.com/docs/deployments/overview)
- [Supabase 프로덕션 가이드](https://supabase.com/docs/guides/getting-started/local-development)

---

## 체크리스트

배포 전 확인:

- [ ] 로컬에서 `pnpm run build` 성공
- [ ] GitHub 저장소에 코드 푸시 완료
- [ ] Vercel 계정 생성 완료
- [ ] 모든 환경 변수 Vercel에 설정 완료
- [ ] Clerk 도메인 설정 완료
- [ ] 배포 후 기능 테스트 완료

---

**배포 완료 후 배포 URL을 알려주세요!** 🚀

