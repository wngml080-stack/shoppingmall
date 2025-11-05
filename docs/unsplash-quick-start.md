# Unsplash 이미지 기능 빠른 시작 가이드

이 가이드는 Unsplash를 사용하여 상품에 무료 이미지를 추가하는 방법을 간단히 설명합니다.

## 🚀 빠른 시작 (3단계)

### 1단계: Unsplash API 키 발급

1. [Unsplash Developers](https://unsplash.com/developers) 접속
2. "Register as a developer" 클릭
3. "New Application" 클릭
4. 애플리케이션 이름 입력 후 생성
5. **Access Key** 복사

### 2단계: 환경변수 설정

`.env` 파일에 추가:

```env
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=여기에_발급받은_키_입력
```

서버 재시작: `pnpm dev` 중지 후 다시 실행

### 3단계: 이미지 추가하기

1. 브라우저에서 `/admin/products/image-upload` 접속
2. 검색창에 키워드 입력 (예: "fashion", "clothing")
3. 원하는 이미지 클릭
4. 상품 ID 입력 (Supabase에서 확인)
5. "저장" 버튼 클릭

## ✅ 완료!

이제 상품 목록과 상세 페이지에서 이미지가 표시됩니다!

## 📚 더 자세한 정보

- [Unsplash 설정 상세 가이드](./unsplash-setup-guide.md)
- [환경변수 설정 가이드](./env-file-guide.md)

