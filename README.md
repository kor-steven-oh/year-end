# S.LSI 송년의 밤 · 호암미술관 희원 산책

S.LSI 송년의 밤(2026. 11. 12 목, 17:30 – 18:00) 참석자에게 사전 안내하는 모바일 웹 페이지입니다.
호암미술관 전통정원 **희원**을 걷는 12개 지점의 산책 코스를 안내합니다. 한국어(기본)와 영어(`?lang=en`)를 지원합니다.

**접속 링크: <https://github.samsungds.net/pages/steven-oh/mobile-year-end/site/>**

### 일반 폰

![PC 미리보기 - 일반 폰](docs/desktop-phone.jpg)

### 갤럭시 Z 폴드 펼침

![PC 미리보기 - 갤럭시 Z 폴드 펼침](docs/desktop-fold.jpg)

## 주요 기능

- **코스 지도**: 경로가 그려지는 애니메이션과 번호 핀. 지도를 누르면 핀치·드래그·더블탭으로 확대해 볼 수 있습니다.
- **내 위치(GPS)**: 지도 위에 현재 위치와 정확도를 표시합니다. 위치 정보는 `https` 주소에서만 동작합니다.
- **지점 상세**: 안내소부터 호암카페까지 12개 지점의 사진과 설명, 사진촬영 지점 표시, 상단 진행 바, 사진 확대 보기.
- **PC 미리보기**: 넓은 화면(마우스 환경)에서는 휴대폰 또는 갤럭시 Z 폴드 펼침 프레임 안에 같은 페이지를 보여주고, 왼쪽에 행사 개요를 표시합니다.
- **다국어**: 같은 페이지에서 KO / EN 전환.

## 구성

```
site/                 배포 대상 (정적 파일, 빌드 단계 없음)
├─ index.html         마크업
├─ css/style.css      스타일
├─ js/
│  ├─ frame-init.js   iframe·PC 모드 판별 (head에서 먼저 실행)
│  ├─ desk.js         PC 폰/폴드 프레임, 전환 애니메이션, 개요 패널 맞춤
│  └─ app.js          코스 데이터(STOPS·ROUTE), 지도, 확대 보기, GPS, KO/EN
└─ img/               웹용 이미지 (WebP)
scripts/
├─ build_images.py    원본 이미지 → site/img/*.webp 변환
├─ check.mjs          브라우저 검수 (지도·GPS·확대 보기, JS 에러 확인)
└─ shot.mjs           모바일 화면 스크린샷
docs/                 README용 이미지
```

## 실행

정적 파일이라 `site/` 폴더를 그대로 웹 서버에 올리면 됩니다. 로컬에서는 아무 정적 서버로 열면 됩니다.

```sh
npx serve site
```

`file://`로 열어도 대부분 동작하지만, 내 위치(GPS)는 `https`(또는 `localhost`)에서만 사용할 수 있습니다.

## 내용 수정

- 지점 이름·설명·영문 번역·사진 번호: `site/js/app.js`의 `STOPS`
- 코스 경로 좌표: `site/js/app.js`의 `ROUTE` (지도 이미지 픽셀 기준)
- 총 거리: `site/js/app.js`의 `DISTANCE_KM`
- 색상·여백: `site/css/style.css` 상단 `:root`

## 이미지 만들기

원본(DRM 복호화본 등)은 저장소에 포함하지 않습니다(`.gitignore`). 원본을 프로젝트 루트의 `decrypted/` 등에 두고 변환합니다.

```sh
pip install pillow
python scripts/build_images.py
```

- 코스 사진 `course-1~12.webp`: 원본이 1004×753이라 해상도는 유지하고 품질 95로 저장
- 카페 사진: `site/img/restaurant_cafe.png`(로컬 전용, 5MB)에서 `cafe.webp`(1400px)와 `cafe-2x.webp`(2400px)를 만들고 `srcset`으로 선택
- 사진은 `loading="lazy"`라 스크롤하는 만큼만 내려받습니다.

## 검수

[puppeteer-core](https://www.npmjs.com/package/puppeteer-core)를 전역 설치하고 Chrome 경로를 맞춘 뒤 실행합니다.

```sh
npm i -g puppeteer-core
node scripts/check.mjs   # 지도·GPS·확대 보기, JS 에러 확인
node scripts/shot.mjs    # 스크린샷 → scripts/shots/ (git 제외)
```

## 출처

지점 설명은 호암미술관 공식 홈페이지(leeumhoam.org)를 바탕으로 정리했습니다.
