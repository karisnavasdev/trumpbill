/**
 * Trumpbill — update these with your token links
 */
const LINKS = {
  buyPrimary: "https://https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=soonpump/",
  buyAlt: "https://https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=soonpump/",
  dexscreenerEmbed: "https://dexscreener.com/solana",
  dexscreenerPage: "https://dexscreener.com/solana",
};

const BILL_RAIN_DEFAULT_ON = true;
const BILL_ASSET_SRC = "./banner.png";

const MEMBER_IMAGES = Array.from({ length: 8 }, (_, i) => ({
  src: `./members/${i + 1}.jpg`,
  label: `anon${i + 1}`,
}));

const RAIN_LABEL_ON = "Stop bill rain";
const RAIN_LABEL_OFF = "Toggle bill rain";

function setHrefAll(selector, href) {
  document.querySelectorAll(selector).forEach((el) => {
    el.setAttribute("href", href);
    if (el.tagName === "A") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noreferrer");
    }
  });
}

function setDexEmbed(src) {
  const iframe = document.querySelector("iframe[data-dex]");
  if (!iframe) return;
  iframe.setAttribute("src", src);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createBill() {
  const el = document.createElement("div");
  el.className = "bill";
  const img = document.createElement("img");
  img.className = "bill__img";
  img.src = BILL_ASSET_SRC;
  img.alt = "";
  img.decoding = "async";
  el.appendChild(img);

  const left = rand(-8, 105);
  const dur = rand(7, 14);
  const rot = rand(-22, 22);
  const scale = rand(0.65, 1.05);
  const drift = rand(-18, 18);
  const w = rand(120, 220);

  el.style.left = `${left}vw`;
  el.style.width = `${w}px`;
  el.style.height = `${Math.round(w / 2.5)}px`;
  el.style.opacity = String(rand(0.5, 0.95));

  const startRot = rot;
  const endRot = rot + rand(-35, 35);

  el.animate(
    [
      {
        transform: `translate3d(0, -25vh, 0) rotate(${startRot}deg) scale(${scale})`,
      },
      {
        transform: `translate3d(${drift}vw, 115vh, 0) rotate(${endRot}deg) scale(${scale})`,
      },
    ],
    {
      duration: dur * 1000,
      easing: "linear",
      iterations: 1,
    }
  ).onfinish = () => el.remove();

  return el;
}

function initBillRain() {
  const host = document.querySelector(".bill-rain");
  if (!host) return { start() {}, stop() {}, isRunning: () => false };

  let timer = null;
  let running = false;

  const start = () => {
    if (running) return;
    running = true;
    host.style.display = "block";
    timer = window.setInterval(() => {
      if (!running) return;
      const n = Math.random() < 0.5 ? 1 : 2;
      for (let i = 0; i < n; i++) host.appendChild(createBill());
    }, 480);
  };

  const stop = () => {
    running = false;
    host.style.display = "none";
    if (timer) window.clearInterval(timer);
    timer = null;
    host.querySelectorAll(".bill").forEach((b) => b.remove());
  };

  return { start, stop, isRunning: () => running };
}

function syncRainButtons(running) {
  const label = running ? RAIN_LABEL_ON : RAIN_LABEL_OFF;
  document.querySelectorAll(".toggle-rain").forEach((btn) => {
    btn.textContent = label;
  });
}

function createMemberFrame({ src, label }) {
  const figure = document.createElement("figure");
  figure.className = "member-frame";

  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";

  const caption = document.createElement("figcaption");
  caption.textContent = label;

  figure.append(img, caption);
  return figure;
}

function initMarginGalleries() {
  const left = document.querySelector('[data-margin-gallery="left"]');
  const right = document.querySelector('[data-margin-gallery="right"]');
  if (!left || !right || !MEMBER_IMAGES.length) return;

  const leftImages = MEMBER_IMAGES.filter((_, i) => i % 2 === 0);
  const rightImages = MEMBER_IMAGES.filter((_, i) => i % 2 === 1);

  const buildTrack = (images) => {
    const track = document.createElement("div");
    track.className = "margin-gallery__track";
    const frames = images.map(createMemberFrame);
    frames.forEach((frame) => track.appendChild(frame));
    frames.forEach((frame) => track.appendChild(frame.cloneNode(true)));
    return track;
  };

  left.appendChild(buildTrack(leftImages));
  right.appendChild(buildTrack(rightImages));
}

function initMobileNav() {
  const btn = document.querySelector(".burger");
  const nav = document.querySelector(".mobile-drawer");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.hasAttribute("hidden");
    if (open) nav.removeAttribute("hidden");
    else nav.setAttribute("hidden", "");
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => nav.setAttribute("hidden", ""));
  });
}

function init() {
  setHrefAll("a[data-buy]", LINKS.buyPrimary);
  setHrefAll("a[data-buy-alt]", LINKS.buyAlt);
  setHrefAll("a[data-dex-link]", LINKS.dexscreenerPage);
  setDexEmbed(LINKS.dexscreenerEmbed);

  initMobileNav();
  initMarginGalleries();

  const rain = initBillRain();
  document.querySelectorAll(".toggle-rain").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (rain.isRunning()) rain.stop();
      else rain.start();
      syncRainButtons(rain.isRunning());
    });
  });

  if (
    BILL_RAIN_DEFAULT_ON &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    rain.start();
    syncRainButtons(true);
  }
}

document.addEventListener("DOMContentLoaded", init);
