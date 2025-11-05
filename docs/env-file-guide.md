# .env 파일 작성 가이드

## 올바른 형식

### ✅ 권장 형식 (따옴표 없음)

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=uploads

# Unsplash (무료 이미지 API)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### ⚠️ 따옴표가 있는 형식 (작동은 하지만 불필요함)

```env
# 작동은 하지만 따옴표가 값에 포함될 수 있음
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxx"
```

**주의**: 따옴표를 사용하면 따옴표도 값의 일부로 포함될 수 있습니다!

### ❌ 잘못된 형식들

```env
# 1. 공백 문제 (= 앞뒤에 공백)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_xxxxx  ❌

# 2. 값 앞뒤 공백
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= pk_test_xxxxx  ❌
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx   ❌ (끝에 공백)

# 3. 주석과 같은 줄
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx # 주석  ⚠️ (값에 # 포함될 수 있음)

# 4. 따옴표가 불일치
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx  ❌ (따옴표 닫히지 않음)
```

## 체크리스트

`.env` 파일을 작성할 때 확인할 사항:

- [ ] `=` 앞뒤에 공백이 없음
- [ ] 값 앞뒤에 공백이 없음
- [ ] 따옴표를 사용하지 않음 (또는 사용했다면 쌍으로 일치)
- [ ] 각 줄 끝에 공백이 없음
- [ ] 키 이름에 오타가 없음
- [ ] 주석은 `#`로 시작하고 별도 줄에 작성

## 수정 방법

### 1. 현재 .env 파일 확인

프로젝트 루트 디렉토리에서 `.env` 파일을 엽니다.

### 2. 각 환경 변수 확인

다음 형식으로 작성되어 있는지 확인하세요:

```env
변수이름=값
```

**예시:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxx
```

### 3. 문제가 있다면 수정

#### 따옴표가 있다면 제거:
```env
# 변경 전
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"

# 변경 후
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

#### 공백이 있다면 제거:
```env
# 변경 전
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_xxxxx

# 변경 후
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

### 4. 저장 후 서버 재시작

1. `.env` 파일 저장
2. 터미널에서 서버 중지 (Ctrl + C 또는 Cmd + C)
3. 서버 다시 시작: `pnpm run dev`

## 예시: 완전한 .env 파일

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_nBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ymcamrlmtdztxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY2FtcmxtdGR6dCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE4MjQwMDAwLCJleHAiOjE3MTk4MzYwMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY2FtcmxtdGR6dCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MTgyNDAwMDAsImV4cCI6MTcxOTgzNjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

**중요 사항:**
- 각 줄이 깨끗하게 끝남 (끝에 공백 없음)
- `=` 앞뒤에 공백 없음
- 값 앞뒤에 공백 없음
- 따옴표 없음

