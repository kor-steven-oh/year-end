// PC 등 넓은 화면: 이 페이지를 폰 프레임(iframe) 안에 다시 띄움. iframe 안에서는 일반 모바일 화면.
if (top !== self) {
  document.documentElement.classList.add("framed", ...(new URLSearchParams(location.search).get("frame") === "fold" ? ["fold"] : []));
  addEventListener("message", (e) => {
    if (e.source !== parent || !e.data) return;
    if (e.data.frame) document.documentElement.classList.toggle("fold", e.data.frame === "fold");
    if (e.data === "snap") {
      let best = null, area = 0;
      document.querySelectorAll(".hero img, .ph img").forEach((img) => {
        const r = img.getBoundingClientRect(), w = Math.min(r.right, innerWidth) - Math.max(r.left, 0), h = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
        if (w > 0 && h > 0 && w * h > area) { area = w * h; best = img; }
      });
      parent.postMessage({ snap: (best || document.querySelector(".hero img")).currentSrc || document.querySelector(".hero img").src }, "*");
    }
  });
}
// PC 판별: 넓은 화면 + 마우스(hover·정밀 포인터). 휴대폰·태블릿(터치)은 프레임 없이 콘텐츠만.
else if (matchMedia("(min-width: 600px) and (hover: hover) and (pointer: fine)").matches) document.documentElement.classList.add("desk-mode");
