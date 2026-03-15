import { useEffect } from "react";

const CSS = `
@keyframes diya-float {
  0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.1); opacity: 0; }
}
.diya-spark {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  border-radius: 50%;
  animation: diya-float 700ms ease-out forwards;
  box-shadow: 0 0 6px 2px var(--clr), 0 0 12px var(--clr);
  background: radial-gradient(circle, white 20%, var(--clr) 100%);
  width: var(--sz);
  height: var(--sz);
}
.diya-ring {
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,160,30,0.55);
  transform: translate(-50%,-50%);
  transition: left 0.07s ease-out, top 0.07s ease-out;
  box-shadow: 0 0 10px rgba(255,160,30,0.25), inset 0 0 6px rgba(255,160,30,0.1);
}
`;

let injected = false;
let ring: HTMLDivElement | null = null;

export default function StarCursor() {
  useEffect(() => {
    if (!injected) {
      injected = true;
      const s = document.createElement("style");
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    ring = document.createElement("div");
    ring.className = "diya-ring";
    document.body.appendChild(ring);

    let last = 0;
    const onMove = (e: MouseEvent) => {
      if (ring) {
        ring.style.left = `${e.clientX}px`;
        ring.style.top = `${e.clientY}px`;
      }
      const now = Date.now();
      if (now - last < 35) return;
      last = now;

      const hues = [35, 42, 48, 55, 325, 270];
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "diya-spark";
        const hue = hues[Math.floor(Math.random() * hues.length)];
        const sz = 3 + Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        const dist = 15 + Math.random() * 35;
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.setProperty("--clr", `hsl(${hue},100%,65%)`);
        el.style.setProperty("--sz", `${sz}px`);
        el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
        document.body.appendChild(el);
        el.addEventListener("animationend", () => el.remove(), { once: true });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      ring?.remove();
      ring = null;
    };
  }, []);
  return null;
}
