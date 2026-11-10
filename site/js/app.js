// 거리 확정되면 숫자만 넣으세요 (예: 1.2). null 이면 표시하지 않음.
const DISTANCE_KM = 0.9;

// [x, y]: course-map-info.png 픽셀 좌표 (지도 원본 기준 y-28). 빨간 점선에서 추출.
const ROUTE = "75,393 81,382 93,377 105,378 119,378 132,378 145,378 158,378 172,379 183,382 192,389 204,384 217,380 230,379 242,384 255,390 266,396 278,402 290,408 302,410 316,410 329,409 342,407 354,405 368,405 382,404 395,405 408,406 420,408 429,400 437,393 449,396 455,408 466,411 479,411 492,411 503,417 514,411 525,403 536,396 546,388 546,365 540,354 538,339 554,340 566,343 578,349 581,342 571,336 558,334 546,329 541,320 541,306 541,293 541,279 533,272 521,267 508,261 506,249 505,237 505,224 509,218 521,223 533,228 546,233 558,238 570,243 583,248 595,252 607,257 620,261 633,263 646,265 659,267 672,270 685,268 698,265 711,261 722,256 735,253 749,252 758,257 765,268 772,279 780,290 786,301 784,314 774,318 761,318 747,317 740,324 736,335 727,344 727,356 727,368 715,373 704,378 701,391 690,394 677,394 663,393 651,391 638,388 625,386 617,390 615,403 622,413 632,422 644,427 656,431 661,441 659,453 658,467 656,480 655,493 645,500 632,502 620,500 607,503 599,495 591,485 583,476 569,476 557,477 544,477 530,477 517,479 504,481 491,484 479,487 466,488 452,487 439,486 426,484 413,482 400,480 387,478 374,476 361,473 348,471 335,468 322,465 309,463 296,460 284,457 270,454 267,445 270,432 273,418 272,407 261,401 249,395 237,389 226,392 214,398 202,399 190,394 177,390 165,389 151,389 137,388 125,387 112,387 98,386 97,363 97,349 98,336 99,323 103,311 113,303 123,295 134,287 147,285 160,284 172,283 175,271 176,257 178,245 179,232 180,218 181,205 183,192 187,182 200,182 213,182 219,170";

const STOPS = [
  { no: "01", name: "안내소", hanja: "", at: [80, 392], imgs: [1],
    tag: "산책의 출발점",
    body: "주차장에 내려 처음 만나는 공간입니다. 전시와 정원, 프로그램 등 미술관 이용 안내를 받을 수 있습니다.",
    en: {"name": "Information Center", "tag": "Where the walk begins", "body": "The first place you reach from the parking lot. Find information on exhibitions, the garden and programs here."} },
  { no: "02", name: "보화문", hanja: "葆華門", at: [268, 392], imgs: [2],
    tag: "예술을 거두어 모으는 문",
    body: "바깥 마당과 매화나무 숲 ‘매림(梅林)’을 잇는 전통정원의 시작점입니다. 덕수궁 유현문을 본떠 전통 문양의 전돌을 쌓아 올렸습니다. 거두어 보존한다는 ‘보(葆)’에 꽃과 예술을 뜻하는 ‘화(華)’를 더해, 모든 예술품을 모아 보존하는 미술관 정원의 뜻을 담았습니다.",
    en: {"name": "Bohwamun Gate", "tag": "A gate that gathers art", "body": "The starting point of the garden, linking the outer yard with the Plum Grove. Modeled after Yuhyeonmun Gate at Deoksugung Palace, it is built of bricks bearing traditional Korean patterns. Its name joins bo (葆), to gather and preserve, with hwa (華), flowers and the art of humankind — the mission of a museum garden that collects and keeps works of art."} },
  { no: "03", name: "관음정", hanja: "觀音亭", at: [503, 417], imgs: [3],
    tag: "연못에 두 발을 담근 한 칸 정자",
    body: "가실리의 옛 지형을 되살려 꾸민 작은 동산 ‘소원(小園)’에 자리합니다. 꽃 계단인 화계(花階)와 연못, 그리고 연못에 두 발을 담근 한 칸 정자로 이루어져 있습니다. 수면 위 기암괴석과 앞산을 바라보는 단아한 정자 주위로, 가을이면 산국을 비롯한 국화 향이 가득합니다.",
    en: {"name": "Kwaneum Pavilion", "tag": "A pavilion with its feet in the pond", "body": "Set in the Small Garden, a mound shaped after the old landscape of Gasil-ri, with flowered terraces, a pond and a single-bay pavilion standing with two feet in the water. Odd-shaped rocks rest on the surface, and each autumn wild chrysanthemums scent the air around the pavilion."} },
  // 확인 필요: 공식 지도에 ④ 지점명 없음. 사진(돌계단·석주) 기준 '후원 가는 길'로 표기.
  { no: "04", name: "후원 가는 길", hanja: "後園", at: [548, 378], imgs: [4],
    tag: "미술관 뒤편으로 오르는 돌계단",
    body: "미술관의 측면과 후면은 전통정원의 후원에 해당합니다. 화강암 장대석으로 긴 화계를 쌓고 전돌 담을 둘러 뒷동산과 경계를 두었으며, 초화류와 석조물, 동산의 나무와 꽃이 한데 어우러집니다.",
    en: {"name": "Path to the Rear Garden", "tag": "Stone steps up behind the museum", "body": "The sides and back of the museum form the Rear Garden. Long terraces of granite and a patterned brick wall separate it from the hill behind, where flowers, stone works and the trees of the mound blend together."} },
  { no: "05·06", name: "묵시암", hanja: "默視庵", at: [572, 344], imgs: [5, 6], photo: true,
    tag: "고요함 속에서 바라보다",
    body: "이우환 작가가 2025년 희원 안에 선보인 신작 〈실렌티움(Silentium)〉입니다. 라틴어로 ‘침묵’, 한국어 이름 묵시암은 ‘고요함 속에서 바라본다’는 뜻입니다. 입구의 무거운 돌과 두꺼운 철판 설치 작품이 침묵과 사색의 공간으로 이끄는 안내자 역할을 합니다.",
    en: {"name": "Silentium", "tag": "Seeing in stillness", "body": "A 2025 work by Lee Ufan within Heewon. Silentium is Latin for “silence,” and its Korean title, Muksiam, means “seeing in stillness.” At the entrance, an installation of heavy stone and thick steel plate guides visitors into a space of silence and contemplation.", "hanja": "Muksiam · 默視庵"} },
  // 확인 필요: 다보탑 상세(제작 시기·모본)는 공식 페이지에 없음. 일반 설명으로 작성.
  { no: "07", name: "다보탑", hanja: "多寶塔", at: [507, 222], imgs: [7],
    tag: "미술관 곁을 지키는 탑",
    body: "불국사 다보탑의 형태를 따른 석탑입니다. 네모난 기단 위에 돌사자를 두고, 난간과 팔각의 몸돌, 연꽃 받침이 층층이 올라가는 화려하고 독창적인 구조가 특징입니다.",
    en: {"name": "Dabotap Pagoda", "tag": "A pagoda beside the museum", "body": "A stone pagoda modeled on Dabotap at Bulguksa Temple. Stone lions sit on its square base, above which railings, octagonal bodies and lotus-shaped supports rise tier upon tier in an ornate and singular design."} },
  // 확인 필요: 석탑 명칭·시대 정보 없음. 후원 공식 설명 기반으로 작성.
  { no: "08", name: "석탑", hanja: "石塔", at: [755, 254], imgs: [8],
    tag: "소나무 숲 아래의 석조물",
    body: "미술관 뒤편 후원의 소나무 숲 사이에 석탑과 석등이 놓여 있습니다. 전돌 담과 화계, 오래된 석조물이 어우러진 후원의 고요한 풍경을 느껴 보세요.",
    en: {"name": "Stone Pagoda", "tag": "Stone works beneath the pines", "body": "Among the pines of the Rear Garden stand a stone pagoda and stone lanterns. Take in the quiet scene of brick walls, flower terraces and old stone works."} },
  { no: "09", name: "읍청문", hanja: "揖靑門", at: [786, 306], imgs: [9],
    tag: "정원에서 유일한 둥근 문",
    body: "정원 동쪽에 자리한 문으로, 전돌로 보름달 모양의 출입구를 내고 길상무늬와 꽃무늬를 가득 채웠습니다. 생김새 때문에 ‘월문(月門)’이라고도 부르며, 정원의 협문 가운데 유일한 원형입니다. 동쪽에 있어 ‘봄’을 뜻하기도 합니다.",
    en: {"name": "Eupcheongmun Gate", "tag": "The garden’s only round gate", "body": "Set in the east of the garden, this gate has a full-moon opening of bricks filled with auspicious and floral patterns. Its shape earns it the name Moon Gate. It is the only circular side gate in the garden, and its eastern position makes it a symbol of spring."} },
  // 확인 필요: 팔각오층석탑 상세 정보 없음. 양대 공식 설명 기반으로 작성.
  { no: "10", name: "팔각오층석탑", hanja: "八角五層石塔", at: [728, 352], imgs: [10],
    tag: "양대 너머로 솟은 다섯 층",
    body: "미술관 앞 잔디 마당 ‘양대(陽臺)’ 곁에 선 팔각 오층 석탑입니다. 양대 주위에는 소나무와 대나무, 매화, 난처럼 군자의 덕목을 상징하는 꽃과 나무를 심었고, 미술관 왼편에는 음(陰)을 뜻하는 검은 돌의 월대를 두어 음양의 조화를 이루었습니다.",
    en: {"name": "Octagonal Five-Story Pagoda", "tag": "Five tiers beyond the Yangdae", "body": "An octagonal five-story stone pagoda beside the Yangdae, the lawn in front of the museum. Pine, bamboo, plum and orchid — plants symbolizing the virtues of a noble person — surround the lawn, while the dark-stone Woldae to the left of the museum stands for yin, in balance with it."} },
  { no: "11", name: "호암정", hanja: "湖巖亭", at: [645, 428], imgs: [11], photo: true,
    tag: "주정을 한눈에 담는 정자",
    body: "주정의 풍광을 한눈에 볼 수 있도록 세운 한 칸 정자입니다. 호암미술관 설립자인 고 이병철 회장의 아호를 따 이름 지어, 미술관의 역사와 의미를 상징적으로 보여 줍니다. 정자를 감싼 단풍이 특히 아름다운 곳입니다.",
    en: {"name": "HOAM Pavilion", "tag": "A pavilion overlooking the Main Garden", "body": "A single-bay pavilion built to take in the whole of the Main Garden. Named after the pen name of the museum’s founder, the late Chairman Lee Byung-chull, it symbolizes the museum’s history and meaning. The maples around it are especially beautiful."} },
  { no: "12", name: "법연지", hanja: "法蓮池", at: [625, 501], imgs: [12], photo: true,
    tag: "진흙 속에서 피는 맑은 꽃처럼",
    body: "미술관 정면의 1,200여 평 마당 ‘주정(主庭)’ 한가운데 놓인 네모반듯한 연못입니다. 진흙에서도 맑은 꽃을 피우는 연꽃처럼 인간 정신의 아름다운 승화를 기원하며 붙인 이름입니다. 동쪽의 소나무 산, 북쪽의 미술관, 남쪽의 산과 호수가 담 안팎에서 하나로 어우러집니다.",
    en: {"name": "Lotus Pond", "tag": "Like a clear flower rising from mud", "body": "A square pond at the heart of the Main Garden, the 4,000 m² yard in front of the museum. It is named in the hope that the human spirit may rise beautifully, like the lotus that blooms clean from the mud. Pine-covered hills to the east, the museum to the north and mountains and a lake to the south meet within and beyond the garden walls."} },
];

const $ = (s) => document.querySelector(s);

// ---------- 언어: ?lang=en 이면 영문 ----------
const LANG = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "ko";
const I = {
  ko: { photo: "사진촬영", photoS: "사진촬영", shootT: "사진촬영 지점", shootD: "이곳에서 잠시 멈춰 사진을 남겨 보세요.", finish: "도착 호암카페", mapT: "희원 산책 코스",
        outside: "현재 희원 밖에 계셔서 지도에 위치를 표시할 수 없습니다.", denied: "위치 권한이 꺼져 있습니다. 브라우저 설정에서 위치 접근을 허용해 주세요.",
        fail: "현재 위치를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.", https: "위치 확인은 https 주소에서만 사용할 수 있습니다.", locating: "현재 위치를 확인하는 중입니다…" },
  en: { photo: "Photo Spot", photoS: "Photo", shootT: "Photo Spot", shootD: "Pause here and take a photo.", finish: "Finish · HOAM Café", mapT: "Heewon Garden Walk",
        outside: "You’re outside Heewon, so your location can’t be shown on the map.", denied: "Location access is off. Please allow it in your browser settings.",
        fail: "Couldn’t find your location. Please try again shortly.", https: "Location works only on an https address.", locating: "Finding your location…" },
}[LANG];
if (LANG === "en") {
  document.documentElement.lang = "en";
  document.title = "S.LSI Year-End Night · A Walk Through Heewon Garden";
  document.querySelectorAll("[data-en]").forEach((el) => (el.innerHTML = el.dataset.en));
  document.querySelectorAll("[data-en-aria]").forEach((el) => el.setAttribute("aria-label", el.dataset.enAria));
  document.querySelectorAll("[data-en-alt]").forEach((el) => (el.alt = el.dataset.enAlt));
  const lang = $("#lang");
  Object.assign(lang, { href: location.pathname, textContent: "KO", lang: "ko" });
  lang.setAttribute("aria-label", "한국어");
  STOPS.forEach((s) => Object.assign(s, s.en));
}
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

if (DISTANCE_KM) { $("#dist").hidden = false; $("#dist dd").textContent = DISTANCE_KM + "km"; }
document.querySelectorAll(".km").forEach((el) => (el.textContent = DISTANCE_KM + "km"));
$("#deskPhoto").textContent = STOPS.filter((s) => s.photo).map((s) => s.name).join(" · ");

// 지도: 경로 + 핀
const d = "M" + ROUTE.split(" ").join(" L");
$("#route").setAttribute("d", d);
$("#routeBg").setAttribute("d", d);
const route = $("#route"), len = route.getTotalLength();
route.style.strokeDasharray = len;
route.style.strokeDashoffset = len;

const svgNS = "http://www.w3.org/2000/svg";
// "05·06"처럼 묶인 지점은 핀을 오른쪽으로 나란히 붙여 각각 표시 (지름 30 간격)
const pinData = STOPS.flatMap((s, i) => s.no.split("·").map((n, j) => ({
  id: "s" + i, label: n.replace(/^0/, ""), at: [s.at[0] + j * 30, s.at[1]], aria: s.no + " " + s.name,
}))).concat({ id: "finish", label: "", at: [219, 162], end: true, aria: I.finish });
pinData.forEach((p, i) => {
  const a = document.createElementNS(svgNS, "a");
  a.setAttribute("href", "#" + p.id);
  a.setAttribute("aria-label", p.aria);
  a.setAttribute("class", "pin" + (p.end ? " end" : ""));
  a.style.transitionDelay = (0.25 + i * 0.2) + "s";
  a.innerHTML = `<circle cx="${p.at[0]}" cy="${p.at[1]}" r="${p.end ? 9 : 15}"/>` +
    (p.label ? `<text x="${p.at[0]}" y="${p.at[1] + 1}">${p.label}</text>` : "");
  $("#pins").appendChild(a);
});

// 인덱스 + 지점 섹션 (2열: 왼쪽 열 위→아래 다음 오른쪽 열, 열마다 높이 독립)
const li = (s, i) => {
  const ns = s.no.split("·"), k = s.photo ? `<span class="k">${I.photoS}</span>` : "";
  const num = ns.length > 1 ? `<span class="ns">${ns.map((n) => `<span class="n">${n}</span>`).join("")}</span>` : `<span class="n">${s.no}</span>`;
  return `<li${ns.length > 1 ? ' class="dbl"' : ""}><a href="#s${i}">${num}<span class="t">${esc(s.name)}</span>${k}</a></li>`;
};
// 번호 개수(행) 기준으로 반씩 나눔: 01~06 | 07~12
const rows = STOPS.map((s) => s.no.split("·").length), total = rows.reduce((a, b) => a + b, 0);
let acc = 0, half = STOPS.findIndex((s, i) => (acc += rows[i]) >= total / 2) + 1;
const items = STOPS.map(li);
$("#index").innerHTML = `<ol>${items.slice(0, half).join("")}</ol><ol>${items.slice(half).join("")}</ol>`;

$("#stops").innerHTML = STOPS.map((s, i) => `
  <article class="stop" id="s${i}" data-i="${i}">
    <div class="ph-box reveal">
      <figure class="ph${s.imgs.length > 1 ? " multi" : ""}">
        ${s.imgs.map((n) => `<img src="img/course-${n}.webp" alt="${esc(s.name)}" loading="lazy" width="1004" height="753">`).join("")}
      </figure>
      ${s.imgs.length > 1 ? `<span class="count">1 / ${s.imgs.length}</span>` : ""}
      <span class="zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5M10 19H5v-5"/></svg></span>
      ${s.photo ? `<span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>${I.photo}</span>` : ""}
    </div>
    <div class="txt reveal">
      <p class="no"><span>${s.no}</span></p>
      <h3>${esc(s.name)}${s.hanja ? `<em>${s.hanja}</em>` : ""}</h3>
      <p class="tag">${esc(s.tag)}</p>
      <p class="body">${esc(s.body)}</p>
      ${s.photo ? `<div class="shoot"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></i><p><b>${I.shootT}</b><span>${I.shootD}</span></p></div>` : ""}
    </div>
  </article>`).join("");

// 다중 사진 카운터
document.querySelectorAll(".ph.multi").forEach((el) => {
  const c = el.parentNode.querySelector(".count"), n = el.querySelectorAll("img").length;
  el.addEventListener("scroll", () => { c.textContent = Math.round(el.scrollLeft / el.clientWidth) + 1 + " / " + n; }, { passive: true });
});

// 등장 애니메이션
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { rootMargin: "0px 0px -10% 0px" });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// 지도 경로 그리기: 지도가 보이는 동안 REPLAY_MS마다 처음부터 다시 그림 (안 보이면 멈춤)
const REPLAY_MS = 7000;
const draw = () => {
  route.style.transition = "none";
  route.style.strokeDashoffset = len;
  route.getBoundingClientRect(); // 리셋 위치를 먼저 반영시킨 뒤 전환 재개
  route.style.transition = "";
  route.style.strokeDashoffset = 0;
};
let replay = null;
new IntersectionObserver(([e]) => {
  clearInterval(replay); replay = null;
  if (!e.isIntersecting) return;
  $("#mapSvg").classList.add("drawn");
  draw();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) replay = setInterval(draw, REPLAY_MS);
}, { threshold: 0.4 }).observe($("#mapbox"));

// 상단 진행 바 + 지도 버튼
const bar = $("#bar"), fab = $("#fab");
const stopIO = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  const i = +e.target.dataset.i, s = STOPS[i];
  $("#barNo").textContent = s.no;
  $("#barName").textContent = s.name;
  const at = +s.no.split("·").pop(), total = +STOPS[STOPS.length - 1].no;
  $("#barOf").textContent = at + " / " + total;
  $("#barFill").style.width = (at / total * 100) + "%";
}), { rootMargin: "-45% 0px -55% 0px" });
document.querySelectorAll(".stop").forEach((el) => stopIO.observe(el));

const onScroll = () => {
  const y = scrollY, st = $("#stops"), top = st.offsetTop - 60, bottom = $("#finish").offsetTop - innerHeight * 0.5;
  bar.classList.toggle("on", y > top && y < bottom);
  fab.classList.toggle("on", y > innerHeight * 0.8 && Math.abs(y - $("#map").offsetTop) > innerHeight * 0.6);
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- 토스트 ----------
let toastT;
const toast = (msg) => {
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3200);
};

// ---------- 확대 보기 (지도·사진 공용, 핀치/드래그/더블탭) ----------
const vw = $("#vw"), stage = $("#vwStage"), vc = $("#vwC"), mapSvg = $("#mapSvg");
// FULL: 새 지도 전체 범위 (기존 지도 좌표 기준 x, y, w, h)
const MAP_CROP = mapSvg.getAttribute("viewBox"), FULL = [-18.5, 23.7, 1047.2, 560];
history.scrollRestoration = "manual";
let cur = null, k = 1, tx = 0, ty = 0;

const clampK = (v) => Math.min(6, Math.max(1, v));
const apply = () => {
  const W = stage.clientWidth, H = stage.clientHeight, w = cur.w * k, h = cur.h * k;
  tx = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, tx));
  ty = h <= H ? (H - h) / 2 : Math.min(0, Math.max(H - h, ty));
  vc.style.transform = `translate(${tx}px, ${ty}px) scale(${k})`;
};
const zoomAt = (px, py, nk) => { tx = px - (px - tx) * (nk / k); ty = py - (py - ty) * (nk / k); k = nk; };
const fit = () => {
  const W = stage.clientWidth, H = stage.clientHeight;
  cur.w = W; cur.h = W * cur.ar;
  if (cur.h > H) { cur.h = H; cur.w = H / cur.ar; }
  vc.style.width = cur.w + "px"; vc.style.height = cur.h + "px";
  k = 1; tx = ty = 0;
  if (cur.map) { // 지도는 세로 화면을 채우도록 코스 중심(약 435,350)에 맞춰 확대해서 시작
    k = clampK(Math.min(H / cur.h, 3));
    tx = W / 2 - (435 - FULL[0]) / FULL[2] * cur.w * k; ty = H / 2 - (350 - FULL[1]) / FULL[3] * cur.h * k;
  }
  apply();
};
const openVw = (o) => {
  cur = o;
  $("#vwTitle").innerHTML = o.title;
  if (o.map) { mapSvg.setAttribute("viewBox", FULL.join(" ")); vc.appendChild(mapSvg); }
  else vc.appendChild(o.el);
  $("#vwLoc").hidden = !o.map;
  vw.classList.add("on");
  document.body.style.overflow = "hidden";
  history.pushState({ vw: 1 }, "");
  fit();
};
const doClose = () => {
  if (!cur) return;
  if (cur.map) { mapSvg.setAttribute("viewBox", MAP_CROP); $("#mapSlot").appendChild(mapSvg); }
  vc.replaceChildren();
  vw.classList.remove("on");
  document.body.style.overflow = "";
  cur = null;
};
const closeVw = () => (history.state && history.state.vw ? history.back() : doClose());
addEventListener("popstate", doClose);
$("#vwX").addEventListener("click", closeVw);
addEventListener("keydown", (e) => e.key === "Escape" && cur && closeVw());
addEventListener("resize", () => cur && fit());

// 지도 섹션을 지나치지 않고 바로 열어도 경로·핀이 보이도록 먼저 그림
const openMap = () => ($("#mapSvg").classList.add("drawn"), draw(), openVw({ map: true, ar: FULL[3] / FULL[2], title: `${I.mapT} · ${DISTANCE_KM} km` }));
$("#mapbox").addEventListener("click", (e) => { if (!e.target.closest("a, button")) openMap(); });
$("#fab").addEventListener("click", (e) => { e.preventDefault(); openMap(); });
$("#stops").addEventListener("click", (e) => {
  const img = e.target.closest(".ph img");
  if (!img) return;
  const s = STOPS[img.closest(".stop").dataset.i], el = new Image();
  el.src = img.src; el.alt = img.alt;
  openVw({ el, ar: (img.naturalHeight || 753) / (img.naturalWidth || 1004), title: `<span>${s.no}</span>${esc(s.name)}` });
});

// 제스처: 포인터 캡처 중에는 click 대상이 stage로 바뀌므로 탭은 직접 판정
const pts = new Map();
let last = null, moved = 0, lastTap = 0;
const gesture = () => {
  const p = [...pts.values()], r = stage.getBoundingClientRect();
  const x = p.reduce((a, q) => a + q[0], 0) / p.length - r.left, y = p.reduce((a, q) => a + q[1], 0) / p.length - r.top;
  return { x, y, d: p.length > 1 ? Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]) : 0 };
};
const animate = () => { vc.style.transition = "transform .25s ease"; setTimeout(() => (vc.style.transition = ""), 260); };
stage.addEventListener("pointerdown", (e) => {
  stage.setPointerCapture(e.pointerId);
  pts.set(e.pointerId, [e.clientX, e.clientY]);
  if (pts.size > 1) moved = 99;
  else moved = 0;
  last = gesture();
});
stage.addEventListener("pointermove", (e) => {
  if (!pts.has(e.pointerId)) return;
  pts.set(e.pointerId, [e.clientX, e.clientY]);
  const g = gesture();
  if (pts.size > 1 && last.d) zoomAt(g.x, g.y, clampK(k * g.d / last.d));
  tx += g.x - last.x; ty += g.y - last.y;
  moved += Math.abs(g.x - last.x) + Math.abs(g.y - last.y);
  last = g; apply();
});
const up = (e) => {
  if (!pts.has(e.pointerId)) return;
  pts.delete(e.pointerId);
  if (pts.size) { last = gesture(); return; }
  if (moved > 6) return;
  const r = stage.getBoundingClientRect(), now = Date.now();
  if (now - lastTap < 300) {
    animate(); zoomAt(e.clientX - r.left, e.clientY - r.top, k > 1.6 ? 1 : 2.5); apply(); lastTap = 0; return;
  }
  lastTap = now;
  const a = document.elementFromPoint(e.clientX, e.clientY)?.closest("#vwC a");
  if (a) { const id = a.getAttribute("href"); closeVw(); setTimeout(() => document.querySelector(id).scrollIntoView(), 80); }
};
stage.addEventListener("pointerup", up);
stage.addEventListener("pointercancel", up);
stage.addEventListener("wheel", (e) => {
  e.preventDefault();
  const r = stage.getBoundingClientRect();
  zoomAt(e.clientX - r.left, e.clientY - r.top, clampK(k * Math.exp(-e.deltaY * 0.002))); apply();
}, { passive: false });

// ---------- GPS 내 위치 ----------
// 지도 픽셀 ↔ 위경도: Esri 위성 타일(z18, 타일 223686/101763 기준)에 지도를 정합한 축척·이동값.
// 기준점 3곳(법연지·미술관·호암카페) 오차 약 2m, OSM 좌표로 교차 확인 오차 2~3m.
const GEO = { s: 0.79821, ox: 223686 * 256 + 526.849, oy: 101763 * 256 + 405.073, Z: 256 * 2 ** 18 };
const toMap = (lat, lon) => {
  const gx = (lon + 180) / 360 * GEO.Z;
  const gy = (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * GEO.Z;
  return [(gx - GEO.ox) / GEO.s, (gy - GEO.oy) / GEO.s];
};
const me = $("#me");
let watchId = null, warned = false;
const setLocUI = (on) => document.querySelectorAll("[data-loc]").forEach((b) => b.classList.toggle("loc-on", on));
const stopLoc = () => {
  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  watchId = null; me.hidden = true; setLocUI(false);
};
const onPos = (p) => {
  const { latitude, longitude, accuracy } = p.coords;
  const [x, y] = toMap(latitude, longitude);
  if (x < FULL[0] - 20 || x > FULL[0] + FULL[2] + 20 || y < FULL[1] - 20 || y > FULL[1] + FULL[3] + 20) {
    me.hidden = true;
    if (!warned) toast(I.outside);
    warned = true; return;
  }
  const mpp = 156543.03392 * Math.cos(latitude * Math.PI / 180) / 2 ** 18 * GEO.s; // 지도 1px당 m
  me.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  me.querySelector(".acc").setAttribute("r", Math.min(accuracy / mpp, 400).toFixed(1));
  me.hidden = false;
};
const onErr = (e) => {
  toast(e.code === 1 ? I.denied : I.fail);
  stopLoc();
};
document.querySelectorAll("[data-loc]").forEach((b) => b.addEventListener("click", (e) => {
  e.stopPropagation();
  if (watchId !== null) return stopLoc();
  if (!("geolocation" in navigator) || !isSecureContext) return toast(I.https);
  warned = false; setLocUI(true); toast(I.locating);
  watchId = navigator.geolocation.watchPosition(onPos, onErr, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
}));
