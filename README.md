# 날씨앱

## 실행 방법

```bash
pnpm install && pnpm dev
```

---

## 기능 설명

- 단일 페이지 웹앱
- 좌측 사이드바에서 즐겨찾기 목록 조회/수정/삭제 가능
- 메인 화면에서 현재 위치 날씨 정보 조회 (시간별/일별)

---

## 의사결정 과정 및 결과

### 1. 일기 API 비교 및 선정

[문서 첨부](./docs/weather-api-comparison.md)

### 2. 하네스 엔지니어링

- [Steiger](https://github.com/feature-sliced/steiger) FSD 커뮤니티에서 제공하는 린터 도입
- 디자인 시스템 [DESIGN.md](./DESIGN.md)를 미리 구축해둔 후에 내규 밖으로 벗어나지 않도록 프롬프팅함
- 폴더구조는 [FSD 커뮤니티](https://fsd.how)에서 제시하는 관례를 엄격하게 따름
- 이외 스타일 규칙은 eslint에 기술하거나 [AGENTS.md](./AGENTS.md) 문서에 기록해둠

### 3. react, nextjs 선정 과정

결과는 React를 선택하였으며 그 과정은 아래에서 설명드립니다.

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
