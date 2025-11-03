# Clerk + Supabase 통합 가이드

## 단계별 설정 가이드

### 단계 1: Clerk Dashboard 접속 및 로그인

1. 브라우저에서 [https://dashboard.clerk.com](https://dashboard.clerk.com) 접속
2. 계정으로 로그인
3. 프로젝트 선택

### 단계 2: Frontend API URL 찾기

**방법 A: 가장 쉬운 방법**
1. 왼쪽 메뉴에서 **"Home"** 클릭
2. 페이지 상단에 있는 프로젝트 정보 확인
3. "Frontend API" 또는 "Environment" 섹션 확인

**방법 B: API Keys 메뉴에서**
1. 왼쪽 메뉴에서 **"API Keys"** 클릭
   - "API Keys"가 안 보이면:
   - **"Configure"** 메뉴 클릭 → **"API Keys"** 클릭
   - 또는 **"Settings"** 메뉴 클릭 → **"API Keys"** 클릭
2. 페이지를 아래로 스크롤
3. **"Frontend API"** 섹션 찾기
4. URL 복사 (예: `https://your-app-12.clerk.accounts.dev`)

**방법 C: Publishable Key에서 확인**
1. API Keys 페이지에서 **"Publishable key"** 복사
   - 형식: `pk_test_xxxxx`
2. 아래 형식으로 URL 구성:
   ```
   https://[앱이름].clerk.accounts.dev
   ```
   예: Publishable key가 `pk_test_dWxxxx`라면
   Frontend API URL은 보통 `https://[프로젝트이름].clerk.accounts.dev` 형식

### 단계 3: Supabase Dashboard 접속

1. 브라우저에서 [https://supabase.com/dashboard](https://supabase.com/dashboard) 접속
2. 계정으로 로그인
3. 프로젝트 선택

### 단계 4: Supabase에서 Clerk 인증 제공자 추가

1. Supabase Dashboard 왼쪽 메뉴에서 **"Settings"** 클릭 (톱니바퀴 아이콘)
2. 아래 메뉴에서 **"Authentication"** 클릭
3. 왼쪽 하위 메뉴에서 **"Providers"** 클릭
4. 페이지를 아래로 스크롤하여 **"Third-Party Auth"** 섹션 찾기
5. 또는 **"Custom JWT"** 섹션 찾기

### 단계 5: Clerk 통합 설정 입력

**옵션 A: "Enable Custom Access Token" 버튼이 있는 경우**
1. **"Enable Custom Access Token"** 버튼 클릭
2. 다음 정보 입력:
   - **Provider Name**: `Clerk`
   - **JWT Issuer (Issuer URL)**: 
     ```
     https://your-app-12.clerk.accounts.dev
     ```
     (단계 2에서 복사한 Frontend API URL 입력)
   - **JWKS Endpoint (JWKS URI)**:
     ```
     https://your-app-12.clerk.accounts.dev/.well-known/jwks.json
     ```
     (위 URL 뒤에 `/.well-known/jwks.json` 추가)
3. **"Save"** 또는 **"Add Provider"** 클릭

**옵션 B: "Add Provider" 버튼이 있는 경우**
1. **"Add Provider"** 또는 **"+ Add Provider"** 버튼 클릭
2. Provider 목록에서 **"Custom"** 또는 **"JWT"** 선택
3. 위와 동일한 정보 입력 후 저장

### 단계 6: 데이터베이스 테이블 확인

1. Supabase Dashboard 왼쪽 메뉴에서 **"Table Editor"** 클릭
2. `users` 테이블이 있는지 확인

**없다면 생성하기:**
1. 왼쪽 메뉴에서 **"SQL Editor"** 클릭
2. **"New query"** 클릭
3. 아래 SQL 코드 복사하여 붙여넣기:

```sql
-- users 테이블 생성
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 비활성화 (개발 중)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
```

4. **"Run"** 또는 **"▶ Run"** 버튼 클릭
5. 성공 메시지 확인

### 단계 7: 개발 서버 재시작

1. 터미널에서 서버 중지 (Ctrl + C 또는 Cmd + C)
2. 다시 시작:
   ```bash
   pnpm run dev
   ```

### 단계 8: 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. 로그인 버튼 클릭
3. Clerk 로그인 화면이 나오는지 확인
4. 로그인 성공 후 메인 페이지로 돌아오는지 확인

## 문제 해결

### Frontend API URL을 찾을 수 없는 경우

1. Clerk Dashboard에서 **"Support"** 또는 **"Help"** 메뉴 확인
2. 또는 아래 형식으로 직접 입력해보세요:
   ```
   https://[프로젝트이름].clerk.accounts.dev
   ```
   예: 프로젝트 이름이 "my-app"이라면 `https://my-app.clerk.accounts.dev`

### Supabase에서 "Third-Party Auth" 섹션이 안 보이는 경우

1. Supabase 프로젝트가 최신 버전인지 확인
2. Settings → Authentication → Providers 페이지에서 다른 섹션 확인
3. "Custom JWT" 또는 "External Auth" 메뉴 확인

### 여전히 에러가 발생하는 경우

1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭에서 에러 메시지 확인
3. 에러 메시지를 복사하여 알려주세요

