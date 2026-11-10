if (document.documentElement.classList.contains("desk-mode")) {
  const dev = document.getElementById("device"), ph = document.getElementById("phone"), flap = document.getElementById("flap");
  const frame = document.getElementById("phoneFrame");
  const FRAMES = { phone: { w: 418, h: 890 }, fold: { w: 766, h: 848 } };
  const FOLD_SHIFT = 60; // 폴드로 펼칠 때 먼저 왼쪽으로 미는 거리(px)
  const EASE = "cubic-bezier(.4,0,.2,1)";
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mode = "phone", busy = false;
  try { if (localStorage.getItem("frame") === "fold") mode = "fold"; } catch (e) {}
  // 기기별 위치·크기·배율. 일반 폰은 화면 가운데, 폴드는 폰 왼쪽 끝에서 FOLD_SHIFT만큼 왼쪽에서 시작해 오른쪽으로 펼쳐짐.
  // closed = 접힌 폴드(왼쪽 절반 + 테두리)
  const geom = (m) => {
    const W = innerWidth, P = FRAMES.phone, F = FRAMES.fold;
    const kp = Math.min(1, (innerHeight - 64) / P.h), lp = W / 2 - (P.w / 2) * kp;
    if (m === "phone") return { lx: lp, w: P.w, h: P.h, k: kp };
    const lx = lp - FOLD_SHIFT, k = Math.min(1, (innerHeight - 64) / F.h, (W - lx - 24) / F.w);
    return { lx, w: m === "closed" ? F.w / 2 + 8 : F.w, h: F.h, k };
  };
  const set = (g) => { dev.style.setProperty("--lx", g.lx + "px"); dev.style.setProperty("--fw", g.w + "px"); dev.style.setProperty("--fh", g.h + "px"); dev.style.setProperty("--k", g.k); };
  const kf = (g) => ({ left: g.lx + "px", width: g.w + "px", height: g.h + "px", marginTop: -g.h / 2 + "px", transform: `scale(${g.k})` });
  const run = (el, frames, ms, opts = {}) => el.animate(frames, { duration: still ? 0 : ms, easing: EASE, fill: "forwards", ...opts }).finished;
  // 기기 모양별 곡률·카메라: o = 프레임 바깥, i = 화면(iframe)·베일 (바깥 - 베젤 8px), n = ::after 카메라
  const SHAPE = {
    phone: { o: "52px", i: "44px", n: { width: "92px", height: "26px", marginLeft: "-46px", top: "18px" } },
    closed: { o: "30px 6px 6px 30px", i: "22px 2px 2px 22px", n: { width: "10px", height: "10px", marginLeft: "-5px", top: "20px" } },
  };
  // 크기(dev) · 프레임 곡률 · 화면 곡률(iframe, 베일) · 카메라를 한 타임라인에서 동시에 보간. 끝나면 after()로 클래스를 맞춘 뒤 애니메이션 해제
  const morph = async (a, b, ms, from, to, after) => {
    const A = SHAPE[from], B = SHAPE[to], clip = (r) => `inset(0 round ${r})`;
    const anims = [
      [dev, [kf(a), kf(b)]],
      [ph, [{ borderRadius: A.o }, { borderRadius: B.o }]],
      [frame, [{ borderRadius: A.i, clipPath: clip(A.i) }, { borderRadius: B.i, clipPath: clip(B.i) }]],
      [veil, [{ borderRadius: A.i }, { borderRadius: B.i }]],
      [ph, [A.n, B.n], { pseudoElement: "::after" }],
    ].map(([el, f, o]) => el.animate(f, { duration: still ? 0 : ms, easing: EASE, fill: "forwards", ...o }));
    await Promise.all(anims.map((x) => x.finished));
    if (after) after();
    set(b); anims.forEach((x) => x.cancel());
  };
  const layout = () => { if (!busy) set(geom(mode)); };
  const press = () => document.querySelectorAll(".frame-sw button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.frame === mode));
  const tell = () => frame.contentWindow.postMessage({ frame: mode }, "*");
  const HALF = "inset(0 50% 0 0)";

  // 지금 보이는 사진 주소를 iframe에 요청 (전환 중 블러 이미지로 사용). 응답 없으면 첫 화면 사진
  const veil = document.getElementById("veil");
  const snap = () => new Promise((res) => {
    const h = (e) => { if (e.source === frame.contentWindow && e.data && e.data.snap) { removeEventListener("message", h); res(e.data.snap); } };
    addEventListener("message", h);
    frame.contentWindow.postMessage("snap", "*");
    setTimeout(() => { removeEventListener("message", h); res(new URL("img/hero.webp", location.href).href); }, 400);
  });
  const fade = (el, a, b, ms) => run(el, [{ opacity: a }, { opacity: b }], ms);
  const clear = (...els) => els.forEach((el) => el.getAnimations().forEach((x) => x.cancel()));

  // 펼치기: 폰 → 폴드 덮은(커버) 비율 → 블러 이미지로 전환 → 덮개가 경첩 축으로 젖혀지며 펼침 → 실제 화면
  const unfold = async () => {
    dev.style.setProperty("--snap", `url("${await snap()}")`);
    dev.classList.add("closed");
    await morph(geom("phone"), geom("closed"), 500, "phone", "closed");
    await fade(veil, 0, 1, 260); veil.style.opacity = 1;
    tell();
    dev.classList.remove("closed"); dev.classList.add("fold"); set(geom("fold"));
    ph.style.clipPath = veil.style.clipPath = HALF; flap.style.display = "block";
    await run(flap, [{ transform: "rotateY(-180deg)" }, { transform: "rotateY(0deg)" }], 900, { easing: "cubic-bezier(.5,0,.25,1)" });
    ph.style.clipPath = veil.style.clipPath = "";
    flap.style.display = "none"; clear(flap, veil);
    await fade(veil, 1, 0, 380); veil.style.opacity = 0; clear(veil);
  };
  // 접기: 블러 이미지로 전환 → 오른쪽 절반이 경첩 축으로 접혀 덮임 → 커버 화면 → 폰 크기로 제자리
  const fold = async () => {
    dev.style.setProperty("--snap", `url("${await snap()}")`);
    flap.style.display = "block";
    await Promise.all([fade(veil, 0, 1, 260), fade(flap.querySelector(".f"), 0, 1, 260)]);
    veil.style.opacity = 1; clear(flap.querySelector(".f"));
    ph.style.clipPath = veil.style.clipPath = HALF;
    await run(flap, [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)" }], 850, { easing: "cubic-bezier(.6,0,.4,1)" });
    tell();
    dev.classList.remove("fold"); dev.classList.add("closed"); set(geom("closed"));
    ph.style.clipPath = veil.style.clipPath = ""; flap.style.display = "none"; clear(flap, veil);
    await fade(veil, 1, 0, 300); veil.style.opacity = 0; clear(veil);
    await morph(geom("closed"), geom("phone"), 500, "closed", "phone", () => dev.classList.remove("closed"));
  };

  // 처음 한 번만 iframe 주소 지정 (?frame=fold 로 안쪽 상단 여백 결정). 이후 전환은 메시지로.
  const u = new URL(location.href);
  u.hash = "";
  if (mode === "fold") u.searchParams.set("frame", "fold");
  frame.src = u.pathname + u.search;
  dev.classList.toggle("fold", mode === "fold");
  press(); layout();
  document.querySelectorAll(".frame-sw button").forEach((b) => b.addEventListener("click", async () => {
    if (busy || b.dataset.frame === mode) return;
    busy = true; mode = b.dataset.frame; press();
    try { localStorage.setItem("frame", mode); } catch (e) {}
    try { await (mode === "fold" ? unfold() : fold()); } finally { busy = false; layout(); }
  }));
  addEventListener("resize", layout);
  // 왼쪽 개요 패널: 내용(특히 EN)이 화면 높이를 넘으면 스크롤 대신 비율을 줄여 한 화면에 맞춤
  const desk = document.querySelector(".desk"), deskIn = desk.firstElementChild;
  const fitDesk = () => {
    deskIn.style.zoom = 1;
    const cs = getComputedStyle(desk), room = desk.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (room > 0 && deskIn.offsetHeight > room) deskIn.style.zoom = room / deskIn.offsetHeight;
  };
  fitDesk(); document.fonts.ready.then(fitDesk); addEventListener("resize", fitDesk);
}
