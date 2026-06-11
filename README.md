# Backrooms — Level 0

웹에서 가볍게 돌아다닐 수 있는 무한 백룸(Level 0) 탐험 데모입니다. Three.js로 구현했습니다.

## 실행

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

`public/assets/wallpaper.png` 를 사용합니다. 직접 교체하려면 같은 경로에 이미지를 넣으면 됩니다.

```bash
npm run generate:textures
```

위 명령으로 기본 타일형 벽지를 다시 생성할 수 있습니다.

## 빌드

```bash
npm run build
npm run preview
```
