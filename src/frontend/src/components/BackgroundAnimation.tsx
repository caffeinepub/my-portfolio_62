import { useEffect, useRef } from "react";

// ── Diya particle (floating light) ──────────────────────────────────────────
interface Diya {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  hue: number; // saffron 30-50, gold 45-55, lotus pink 320-340
  wobble: number;
  wobbleSpeed: number;
}

function createDiya(w: number, h: number): Diya {
  const palette = [35, 42, 48, 325, 335, 270]; // saffron, gold, lotus, violet
  return {
    x: Math.random() * w,
    y: h + 10,
    vy: -(0.3 + Math.random() * 0.6),
    vx: (Math.random() - 0.5) * 0.3,
    size: 1.5 + Math.random() * 3.5,
    opacity: 0,
    life: 0,
    maxLife: 200 + Math.random() * 300,
    hue: palette[Math.floor(Math.random() * palette.length)],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.02,
  };
}

// ── Mandala ring ─────────────────────────────────────────────────────────────
interface Ring {
  radius: number;
  petals: number;
  angle: number;
  speed: number;
  alpha: number;
  strokeHue: number;
  lineW: number;
}

function drawMandalaPetal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  petals: number,
  angle: number,
  alpha: number,
  hue: number,
  lineW: number,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);
    // Petal shape via bezier
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      radius * 0.4,
      -radius * 0.15,
      radius * 0.9,
      -radius * 0.1,
      radius,
      0,
    );
    ctx.bezierCurveTo(
      radius * 0.9,
      radius * 0.1,
      radius * 0.4,
      radius * 0.15,
      0,
      0,
    );
    ctx.strokeStyle = `hsla(${hue},90%,65%,${alpha})`;
    ctx.lineWidth = lineW;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `hsla(${hue},100%,65%,${alpha * 0.5})`;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function drawLotus(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  angle: number,
  alpha: number,
) {
  const petals = 8;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);
    // outer petals
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(r * 0.3, -r * 0.2, r * 0.8, -r * 0.15, r, 0);
    ctx.bezierCurveTo(r * 0.8, r * 0.15, r * 0.3, r * 0.2, 0, 0);
    const hue = 320 + Math.sin(angle + i) * 20;
    ctx.fillStyle = `hsla(${hue},80%,70%,${alpha * 0.25})`;
    ctx.strokeStyle = `hsla(${hue},80%,80%,${alpha * 0.5})`;
    ctx.lineWidth = 0.6;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  // center dot
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,200,80,${alpha * 0.7})`;
  ctx.shadowBlur = 8;
  ctx.shadowColor = `rgba(255,180,0,${alpha})`;
  ctx.fill();
  ctx.restore();
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Diya particles
    const diyas: Diya[] = Array.from({ length: 60 }, () => {
      const d = createDiya(w, h);
      d.y = Math.random() * h; // stagger initial y
      d.life = Math.random() * d.maxLife;
      return d;
    });

    // Mandala rings — centered
    const rings: Ring[] = [
      {
        radius: 80,
        petals: 8,
        angle: 0,
        speed: 0.003,
        alpha: 0.18,
        strokeHue: 45,
        lineW: 0.8,
      },
      {
        radius: 130,
        petals: 12,
        angle: 0,
        speed: -0.002,
        alpha: 0.13,
        strokeHue: 35,
        lineW: 0.6,
      },
      {
        radius: 185,
        petals: 16,
        angle: 0,
        speed: 0.0015,
        alpha: 0.1,
        strokeHue: 270,
        lineW: 0.5,
      },
      {
        radius: 240,
        petals: 24,
        angle: 0,
        speed: -0.001,
        alpha: 0.08,
        strokeHue: 325,
        lineW: 0.5,
      },
      {
        radius: 300,
        petals: 32,
        angle: 0,
        speed: 0.0008,
        alpha: 0.05,
        strokeHue: 45,
        lineW: 0.4,
      },
    ];

    // Corner lotus flowers
    const lotuses = [
      { x: w * 0.08, y: h * 0.15, r: 55, speed: 0.002, angle: 0, alpha: 0.35 },
      { x: w * 0.92, y: h * 0.12, r: 45, speed: -0.0015, angle: 1, alpha: 0.3 },
      { x: w * 0.05, y: h * 0.82, r: 50, speed: 0.0018, angle: 2, alpha: 0.3 },
      { x: w * 0.95, y: h * 0.85, r: 40, speed: -0.002, angle: 3, alpha: 0.28 },
    ];

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // ── Radial gradient base glow ──
      const glow = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.max(w, h) * 0.55,
      );
      glow.addColorStop(0, "rgba(120,60,0,0.06)");
      glow.addColorStop(0.4, "rgba(80,0,80,0.04)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // ── Corner lotuses ──
      for (const l of lotuses) {
        l.angle += l.speed;
        drawLotus(ctx, l.x, l.y, l.r, l.angle, l.alpha);
      }

      // ── Mandala rings ──
      for (const ring of rings) {
        ring.angle += ring.speed;
        drawMandalaPetal(
          ctx,
          cx,
          cy,
          ring.radius,
          ring.petals,
          ring.angle,
          ring.alpha,
          ring.strokeHue,
          ring.lineW,
        );
      }

      // ── Diya floating particles ──
      for (const d of diyas) {
        d.life++;
        d.wobble += d.wobbleSpeed;
        d.x += d.vx + Math.sin(d.wobble) * 0.4;
        d.y += d.vy;

        const prog = d.life / d.maxLife;
        d.opacity = prog < 0.1 ? prog / 0.1 : prog > 0.8 ? (1 - prog) / 0.2 : 1;

        if (d.life >= d.maxLife || d.y < -20) {
          Object.assign(d, createDiya(w, h));
          continue;
        }

        ctx.save();
        ctx.globalAlpha = d.opacity * 0.75;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${d.hue},100%,72%)`;
        ctx.shadowBlur = d.size * 4;
        ctx.shadowColor = `hsl(${d.hue},100%,65%)`;
        ctx.fill();
        // inner bright core
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${d.hue},100%,95%)`;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      lotuses[0].x = w * 0.08;
      lotuses[0].y = h * 0.15;
      lotuses[1].x = w * 0.92;
      lotuses[1].y = h * 0.12;
      lotuses[2].x = w * 0.05;
      lotuses[2].y = h * 0.82;
      lotuses[3].x = w * 0.95;
      lotuses[3].y = h * 0.85;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
