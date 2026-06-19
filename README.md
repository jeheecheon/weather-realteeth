# 날씨앱

## 실행 방법

1. `pnpm install && pnpm dev`
2. [http://localhost:5173](http://localhost:5173) 접속

데모 URL: [https://weather.jeheecheon.com](https://weather.jeheecheon.com)

---

## 기능 설명

- 단일 페이지 웹앱
- 좌측 사이드바에서 즐겨찾기 목록 조회/수정/삭제 가능
- 메인 화면에서 현재 위치 날씨 정보 조회 (시간별/일별)

---

## 의사결정

### 1. 일기 API 비교 및 선정

[문서 첨부](./docs/weather-api-comparison.md)

### 2. FSD 구조

- 폴더구조는 [FSD 커뮤니티](https://fsd.how)에서 제시하는 관례를 엄격하게 따름
- [Steiger](https://github.com/feature-sliced/steiger) FSD 커뮤니티에서 제공하는 린터를 도입하여 FSD 규칙을 준수함
- [LLM Skill](https://www.skills.sh/feature-sliced/skills/feature-sliced-design)를 활용하여 AI가 FSD 구조를 따르도록 강제함

### 3. react vs nextjs

최종 선택은 React이며 그 과정은 아래와 같습니다.

- 초기 기획에서 단일 페이지로 확정하였음
- SSR, ISR 등의 서버 렌더링 이득이 크지 않을 것이라 판단함
- SEO는 요구사항에 없었으나, 일기예보 특성상 변경이 잦은 데이터라 불필요
- 단일 페이지 웹앱이어서 nextjs가 제공하는 라우팅 시스템, 이미지 최적화 등이 필수가 아니었음

---

## 기술스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Tanstack Query
- Shadcn UI
- react-hot-toast
