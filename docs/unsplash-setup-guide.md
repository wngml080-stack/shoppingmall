# Unsplash API 설정 가이드

이 가이드는 Unsplash API를 사용하여 무료 이미지를 가져오는 방법을 설명합니다.

## 📋 개요

Unsplash는 무료로 사용할 수 있는 고품질 스톡 사진 서비스입니다. 이 프로젝트에서는 Unsplash API를 통해 이미지를 검색하고 상품에 추가할 수 있습니다.

## 🔑 API 키 발급 방법

### 1단계: Unsplash 개발자 계정 생성

1. [Unsplash Developers](https://unsplash.com/developers) 페이지에 접속
2. "Register as a developer" 버튼 클릭
3. Unsplash 계정으로 로그인 (계정이 없으면 회원가입)

### 2단계: 새 애플리케이션 생성

1. 로그인 후 "Your apps" 메뉴 클릭
2. "New Application" 버튼 클릭
3. 애플리케이션 정보 입력:
   - **Application name**: 프로젝트 이름 (예: "My Shopping Mall")
   - **Description**: 간단한 설명 (예: "E-commerce product images")
   - **Website URL**: 배포 URL 또는 `http://localhost:3000` (개발 중)
4. 이용약관 동의 후 "Create application" 클릭

### 3단계: Access Key 복사

1. 생성된 애플리케이션 페이지에서 **"Access Key"** 또는 **"Access Token"** 복사
2. 이 키를 `.env` 파일에 추가

## 📝 환경변수 설정

프로젝트 루트의 `.env` 파일에 다음을 추가하세요:

```env
# Unsplash (무료 이미지 API)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key_here
```

**중요**: 
- `your_access_key_here`를 실제 발급받은 Access Key로 교체하세요
- 공백이나 따옴표 없이 작성하세요
- `.env` 파일 저장 후 서버를 재시작하세요

## 🚀 사용 방법

### 1. 이미지 업로드 페이지 접속

```
http://localhost:3000/admin/products/image-upload
```

### 2. 이미지 검색 및 선택

1. 검색창에 키워드 입력 (예: "fashion", "clothing", "shoes")
2. "검색" 버튼 클릭 또는 Enter 키 누르기
3. 원하는 이미지 클릭하여 선택

### 3. 상품에 이미지 추가

1. "상품 ID" 입력창에 상품 UUID 입력
   - Supabase 대시보드에서 상품 ID 확인 가능
2. 선택사항: "이미지를 Supabase Storage에 저장" 체크박스
   - 체크: 이미지를 우리 서버에 저장 (권장)
   - 해제: Unsplash URL 직접 사용
3. "저장" 버튼 클릭

## 💡 사용 팁

### 좋은 검색어 예시

- **의류**: fashion, clothing, apparel, outfit, style
- **전자제품**: electronics, technology, gadget, device
- **도서**: books, reading, library, education
- **음식**: food, cuisine, restaurant, cooking
- **스포츠**: sports, fitness, workout, gym
- **뷰티**: beauty, cosmetics, skincare, makeup

### 이미지 저장 옵션

**Supabase Storage에 저장 (권장)**
- ✅ 이미지가 우리 서버에 보관되어 안정적
- ✅ Unsplash 서비스 중단 시에도 이미지 유지
- ✅ 이미지 로딩 속도 개선 가능

**Unsplash URL 직접 사용**
- ✅ 빠른 설정
- ⚠️ Unsplash 서비스 의존
- ⚠️ 이미지가 삭제될 수 있음

## 📊 API 제한사항

Unsplash 무료 플랜:
- **시간당 요청**: 50회
- **시간당 다운로드**: 50회
- 일반적인 사용에는 충분합니다

## 🔍 문제 해결

### "Unsplash API 키가 설정되지 않았습니다" 오류

1. `.env` 파일에 `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`가 있는지 확인
2. 키 값이 올바른지 확인 (공백, 따옴표 없이)
3. 서버를 재시작했는지 확인

### "Unsplash API 오류: 401" 오류

- API 키가 잘못되었거나 만료되었을 수 있습니다
- Unsplash 개발자 페이지에서 새 키를 발급받으세요

### "Unsplash API 오류: 403" 오류

- 시간당 요청 제한을 초과했을 수 있습니다
- 잠시 후 다시 시도하세요

### 이미지가 표시되지 않음

1. `next.config.ts`에 Unsplash 도메인이 추가되어 있는지 확인
2. 브라우저 콘솔에서 오류 메시지 확인
3. 이미지 URL이 올바른지 확인

## 📚 추가 자료

- [Unsplash API 문서](https://unsplash.com/documentation)
- [Unsplash 개발자 가이드](https://unsplash.com/developers)
- [Unsplash API 예제](https://unsplash.com/documentation#example-requests)

## ⚠️ 주의사항

1. **저작권**: Unsplash 이미지는 무료로 사용 가능하지만, Unsplash 라이선스를 확인하세요
2. **API 키 보안**: API 키를 공개 저장소에 업로드하지 마세요
3. **사용량 모니터링**: 과도한 요청을 피하기 위해 사용량을 주의 깊게 모니터링하세요

