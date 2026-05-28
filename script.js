/**
 * Trumpbill — update these with your token links
 */
const LINKS = {
  buyPrimary: "https://pumpswap.xyz/",
  buyAlt: "https://pumpswap.xyz/",
  dexscreenerEmbed: "https://dexscreener.com/solana",
  dexscreenerPage: "https://dexscreener.com/solana",
};

const BILL_RAIN_DEFAULT_ON = true;
const BILL_ASSET_SRC = "./banner.png";

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
