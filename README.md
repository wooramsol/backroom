# Backrooms — Level 0

웹에서 가볍게 돌아다닐 수 있는 무한 백룸(Level 0) 탐험 데모입니다. Three.js로 구현했습니다.

## 플레이

| 환경 | URL | 배포 |
|------|-----|------|
| **개발** | https://wooramsol.github.io/backroom/ | `main` push 시 자동 |
| **운영 (테스트)** | https://wooramsol.github.io/backroom-live/ | 수동 (아래 참고) |

- `cursor/*` 브랜치 PR → 빌드 성공 시 **자동 머지**
- `main` push → 개발 서버(`gh-pages`)에 **자동 배포**
- 운영 배포는 **GitHub Actions → Deploy Production → Run workflow** 또는 에이전트에게 "운영 배포해줘" 요청 (`production` 브랜치 push로도 트리거)

### 최초 1회 설정

1. **개발** — 이 저장소(`backroom`) **Settings → Pages → `gh-pages` / `/(root)`**
2. **운영** — [`backroom-live`](https://github.com/wooramsol/backroom-live) 저장소 생성 후 **Settings → Pages → `gh-pages` / `/(root)`**
3. **운영 배포 토큰** — 이 저장소(`backroom`) **Settings → Secrets → Actions** 에 `PAGES_DEPLOY_TOKEN` 추가  
   - GitHub **Personal Access Token** (classic) — `repo` 권한  
   - `backroom-live` 의 `gh-pages` 브랜치에 push 할 수 있어야 함

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 을 열고 화면을 클릭해 시작합니다.

## 조작

- **WASD** — 이동
- **Shift** — 달리기
- **마우스** — 시야 (포인터 잠금)

## 특징

- 청크 기반 무한 방 생성 (이동 시 주변 방이 동적으로 로드)
- 다양한 방 형태: 사각, L자, 육각, 사다리꼴, 복도, 삼각형 등
- 문 크기·위치·스타일이 방마다 다름
- 계단으로 지하(BASEMENT) 및 상층 이동
- Level 0 분위기: 노란 벽지, 습한 카펫 바닥, 형광등 천장
- 가벼운 렌더링: 조명 단순화, 메시 병합, 낮은 텍스처 해상도

## 벽지 텍스처

`public/assets/backroom_wallpaper.webp` 를 **그대로** 타일링합니다. 이미지를 변형하거나 재생성하지 않습니다.

- 한 장의 이미지 = 벽지 **최소 반복 단위** (가로·세로 비율 유지, 찌그러뜨리지 않음)
- 가로 폭 **76cm** (`0.76m`) 기준으로 벽에 반복 적용
- 교체: 위 경로에 원본 webp를 덮어쓰기

## 빌드

```bash
npm run build
npm run preview
```
