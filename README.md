## 1. 요약

회원가입을 통해 상품과 게시물을 등록, 읽기, 수정, 삭제를 할 수 있는 서비스입니다.

## 2.페이지 구조 및 기능

### 2-1. 상품

- /home: 등록된 상품들을 볼 수 있습니다.
- /home/add: 삼품을 등록할 수 있습니다.
- /home/[id]: 상품의 상세 정보를 확인 및 삭제할 수 있습니다.
- /home[id]/edit: 상품의 정보를 수정할 수 있습니다.

### 2-2. 게시물

- /life: 등록된 게시물들을 볼 수 있습니다.
- /life/add: 게시물을 등록할 수 있습니다.
- /life/[id]: 게시물의 상세 정보를 확인 및 삭제할 수 있습니다.
- /life[id]/edit: 게시물을 수정할 수 있습니다.

### 2-3. 마이페이지

- profile: 현재 로그인한 유저의 정보 및 등록한 상품들, 게시물들을 확인할 수 있습니다.

## 3. 기술 스택

### 3-1. **Frontend**

- **Next.js 14**: 서버/클라이언트 컴포넌트 기반의 React 프레임워크
- **React 18**: UI 라이브러리
- **React Hook Form 7**: 폼 상태 관리
- **Tailwind CSS 3**: CSS 프레임워크
- **@heroicons/react 2**: 아이콘 라이브러리

### 3-2. **Backend**

- **Prisma 5**: ORM (데이터베이스 관리)
- **@supabase/supabase-js 2**: Supabase 클라이언트
- **bcrypt 5**: 비밀번호 해싱
- **iron-session 8**: 세션 관리
- **Twilio 5**: SMS 인증 API
- **Validator 13**: 입력값 검증

### 3-3. **Dev Tools**

- **TypeScript 5**: 정적 타입 시스템
- **ESLint 8**: 코드 품질 검사
- **Zod 3**: 스키마 기반 데이터 검증
- **PostCSS 8**: CSS 후처리기

---

## 4. 설치 및 실행

```sh
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

## 5. 기능 이미지 예시

### 5-1. 상품 목록

![스크린샷 2025-02-09 오후 4 49 22](https://github.com/user-attachments/assets/b805f294-0f0a-4a72-99d5-f7cf9fa9ff63)

### 5-1-2. 상품 등록 및 수정 form

![스크린샷 2025-02-09 오후 4 49 36](https://github.com/user-attachments/assets/84dc40f1-f874-4639-89ce-626dc1449dff)

### 5-1-3. 게시물 목록

![스크린샷 2025-02-09 오후 4 51 33](https://github.com/user-attachments/assets/d476bfb0-1a43-4c74-91cf-37edc38b71ec)

### 5-1-4. 게시물 상세

![스크린샷 2025-02-09 오후 4 49 58](https://github.com/user-attachments/assets/ef18a9cc-866b-4112-bff4-47d6c3a017e1)

### 5-1-5. 마이 페이지

![스크린샷 2025-02-09 오후 4 50 42](https://github.com/user-attachments/assets/71cb7ffa-6758-4be3-8b64-0eb42b2a616d)
