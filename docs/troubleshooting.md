# 문제 해결 가이드

## 현재 어떤 에러가 발생하나요?

정확한 문제를 파악하기 위해 다음 정보가 필요합니다:

### 1. 어떤 화면에서 에러가 발생하나요?

- [ ] 홈페이지 (`http://localhost:3000`)
- [ ] 로그인 버튼 클릭 시
- [ ] 로그인 후
- [ ] 다른 페이지

### 2. 정확한 에러 메시지는 무엇인가요?

**브라우저에서 확인:**
1. 브라우저에서 `F12` 키 누르기 (또는 우클릭 → 검사)
2. **Console** 탭 클릭
3. 빨간색 에러 메시지 확인
4. 에러 메시지를 복사해서 알려주세요

**터미널에서 확인:**
1. 서버를 실행하는 터미널 창 확인
2. 빨간색 에러 메시지 확인
3. 에러 메시지를 복사해서 알려주세요

## 체크리스트

다음 항목들을 순서대로 확인해보세요:

### ✅ 1. 환경 변수 확인

- `.env` 파일이 프로젝트 루트 디렉토리에 있는가?
- 모든 환경 변수가 설정되어 있는가?
- `=` 앞뒤에 공백이 없는가?
- 값 앞뒤에 공백이 없는가?
- 따옴표 없이 작성되어 있는가?

### ✅ 2. 서버 재시작

- `.env` 파일 수정 후 서버를 재시작했는가?
  1. 터미널에서 `Ctrl + C` (Mac: `Cmd + C`)로 서버 중지
  2. `pnpm run dev`로 다시 시작

### ✅ 3. Clerk 설정 확인

- Clerk Dashboard에서 Publishable Key와 Secret Key가 올바른가?
- Clerk 프로젝트가 활성화되어 있는가?
- 로그인 방식이 올바르게 설정되어 있는가? (Settings → Authentication)

### ✅ 4. Supabase 설정 확인

- Supabase 프로젝트가 활성화되어 있는가?
- `users` 테이블이 생성되어 있는가?
  - Supabase Dashboard → Table Editor 확인
- Supabase에서 Clerk 통합이 설정되어 있는가?
  - Settings → Authentication → Providers 확인

### ✅ 5. 브라우저 캐시 확인

- 브라우저 캐시를 삭제했는가?
  1. `Ctrl + Shift + Delete` (Mac: `Cmd + Shift + Delete`)
  2. 캐시 선택 후 삭제
  3. 또는 시크릿 모드에서 테스트

## 일반적인 문제와 해결 방법

### 문제 1: "Clerk is not configured" 에러

**원인:** Clerk 환경 변수가 제대로 로드되지 않음

**해결:**
1. `.env` 파일 확인
2. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`와 `CLERK_SECRET_KEY`가 올바른지 확인
3. 서버 재시작

### 문제 2: "Supabase connection failed" 에러

**원인:** Supabase 환경 변수가 제대로 로드되지 않음

**해결:**
1. `.env` 파일 확인
2. `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 올바른지 확인
3. 서버 재시작

### 문제 3: 로그인은 되는데 에러 페이지가 나옴

**원인:** Supabase에서 Clerk 통합이 설정되지 않음

**해결:**
1. Supabase Dashboard → Settings → Authentication → Providers
2. Clerk 통합 설정 확인

### 문제 4: "Table does not exist" 에러

**원인:** `users` 테이블이 생성되지 않음

**해결:**
1. Supabase Dashboard → SQL Editor
2. `setup_schema.sql` 내용 실행

## 빠른 테스트 방법

### 테스트 1: 환경 변수 로드 확인

터미널에서 실행:
```bash
node -e "console.log('CLERK:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10))"
```

결과가 나오면 환경 변수가 로드되고 있습니다.

### 테스트 2: Clerk 기본 작동 확인

1. `http://localhost:3000` 접속
2. "로그인" 버튼 클릭
3. Clerk 로그인 화면이 나오는지 확인

**Clerk 로그인 화면이 나오면:** Clerk 설정은 정상입니다!

**Clerk 로그인 화면이 안 나오면:** Clerk 환경 변수 문제일 가능성이 높습니다.

## 여전히 문제가 있다면

다음 정보를 알려주세요:

1. **에러 메시지** (브라우저 콘솔과 터미널 모두)
2. **어떤 페이지에서 발생하는지**
3. **환경 변수는 모두 설정되어 있는지** (이미 확인됨)
4. **서버를 재시작했는지**

