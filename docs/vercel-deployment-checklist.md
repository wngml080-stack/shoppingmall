# Vercel 배포 체크리스트

이 문서는 Vercel 배포 전 확인할 사항들을 정리한 체크리스트입니다.

## ✅ 배포 전 확인 사항

### 1. 로컬 빌드 테스트

```bash
# 의존성 설치
pnpm install

# 빌드 테스트
pnpm run build

# 성공 메시지 확인
✓ Compiled successfully
```

**문제 발생 시:**
- 빌드 오류 메시지 확인
- 타입 오류 수정
- 환경 변수 확인

### 2. Git 저장소 준비

```bash
# Git 상태 확인
git status

# 모든 파일 커밋
git add .
git commit -m "배포 준비 완료"

# GitHub에 푸시
git push origin main
```

### 3. 환경 변수 준비

배포 전에 다음 환경 변수들을 메모해두세요:

#### Clerk 환경 변수
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/`

#### Supabase 환경 변수
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_STORAGE_BUCKET=uploads`

#### Unsplash 환경 변수 (선택사항)
- [ ] `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` (이미지 기능 사용 시)

### 4. Vercel 계정 준비

- [ ] Vercel 계정 생성 완료
- [ ] GitHub 계정 연결 완료

## 🚀 배포 단계

### Step 1: Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 선택
4. "Import" 클릭

### Step 2: 프로젝트 설정

- [ ] Framework Preset: Next.js (자동 감지됨)
- [ ] Root Directory: `./`
- [ ] Build Command: `pnpm run build` (자동 설정됨)
- [ ] Output Directory: `.next` (자동 설정됨)
- [ ] Install Command: `pnpm install` (자동 설정됨)

### Step 3: 환경 변수 설정

**중요**: 모든 환경 변수를 추가해야 합니다!

1. "Environment Variables" 섹션 클릭
2. 각 환경 변수를 하나씩 추가:
   - Key: 환경 변수 이름
   - Value: 실제 값
   - Environment: "Production", "Preview", "Development" 모두 선택
     - 또는 "Add" 버튼 옆 드롭다운에서 "All Environments" 선택

3. 다음 환경 변수들을 모두 추가:
   - [ ] Clerk 관련 5개
   - [ ] Supabase 관련 4개
   - [ ] Unsplash (선택사항) 1개

### Step 4: 배포 실행

- [ ] "Deploy" 버튼 클릭
- [ ] 빌드 로그 확인 (약 2-3분 소요)
- [ ] "Congratulations!" 메시지 확인
- [ ] 배포 URL 확인 (예: `https://your-project.vercel.app`)

## 🔍 배포 후 확인 사항

### 1. 환경 변수 확인

- [ ] Vercel Dashboard → Settings → Environment Variables
- [ ] 모든 환경 변수가 설정되어 있는지 확인

### 2. Clerk 도메인 설정

- [ ] Clerk Dashboard → Settings → Domains
- [ ] Vercel 배포 URL 추가 (예: `your-project.vercel.app`)
- [ ] Redirect URLs 확인

### 3. 기능 테스트

배포된 사이트에서 다음 기능 테스트:

- [ ] 홈페이지 로드
- [ ] 상품 목록 표시
- [ ] 로그인/회원가입
- [ ] 상품 상세 페이지
- [ ] 장바구니 기능
- [ ] 이미지 표시 (Unsplash 사용 시)

## ❌ 문제 해결

### 빌드 실패

**확인 사항:**
1. Vercel Dashboard → Deployments → 실패한 배포 클릭
2. 빌드 로그 확인
3. 환경 변수 누락 확인
4. 로컬에서 `pnpm run build` 재실행하여 오류 확인

### 환경 변수 오류

**확인 사항:**
1. Vercel Dashboard → Settings → Environment Variables
2. 모든 환경 변수 확인
3. Production, Preview, Development 모두에 설정되어 있는지 확인
4. 재배포 실행

### 페이지 로드 실패

**확인 사항:**
1. 브라우저 콘솔 오류 확인 (F12)
2. 네트워크 탭에서 실패한 요청 확인
3. 환경 변수 값이 올바른지 확인

## 📝 배포 완료 후

배포가 완료되면:

1. **배포 URL 확인**
   - Vercel Dashboard에서 배포 URL 확인
   - 예: `https://your-project.vercel.app`

2. **도메인 설정 (선택사항)**
   - Vercel Dashboard → Settings → Domains
   - 커스텀 도메인 추가 가능

3. **자동 배포 설정 확인**
   - GitHub에 푸시하면 자동으로 재배포됨
   - Vercel Dashboard → Settings → Git에서 확인

## 🎉 완료!

배포가 성공적으로 완료되었습니다!

**배포 URL을 메모해두세요:**
```
https://your-project.vercel.app
```

