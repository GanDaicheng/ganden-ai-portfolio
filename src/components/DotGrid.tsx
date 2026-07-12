import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./DotGrid.css";

type DotGridProps = {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
};

type Dot = {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  active: boolean;
};

const throttle = <T extends (...args: PointerEvent[]) => void>(func: T, limit: number) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};

function hexToRgb(hex: string) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return { r: 139, g: 92, b: 246 };
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

function DotGrid({
  dotSize = 2,
  gap = 30,
  baseColor = "#6366F1",
  activeColor = "#22D3EE",
  proximity = 140,
  speedTrigger = 90,
  shockRadius = 240,
  shockStrength = 2.8,
  maxSpeed = 4200,
  resistance = 720,
  returnDuration = 1.2,
  className = "",
  style,
}: DotGridProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const cell = dotSize + gap;
    const cols = Math.max(1, Math.floor((width + gap) / cell));
    const rows = Math.max(1, Math.floor((height + gap) / cell));
    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          active: false,
        });
      }
    }

    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    buildGrid();
    const wrap = wrapperRef.current;

    if (!wrap) return undefined;

    const resizeObserver = new ResizeObserver(buildGrid);
    resizeObserver.observe(wrap);

    return () => resizeObserver.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    let rafId = 0;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      const wrap = wrapperRef.current;
      if (!canvas || !wrap) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let radius = dotSize / 2;
        let alpha = 0.22;
        let fill = baseColor;

        if (dsq <= proxSq) {
          const distance = Math.sqrt(dsq);
          const t = 1 - distance / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          fill = `rgb(${r}, ${g}, ${b})`;
          radius = dotSize / 2 + t * 1.8;
          alpha = 0.24 + t * 0.62;
        }

        ctx.beginPath();
        ctx.arc(ox, oy, radius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = fill;
        ctx.shadowBlur = dsq <= proxSq ? 12 : 0;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [activeColor, activeRgb, baseColor, baseRgb, dotSize, proximity]);

  useEffect(() => {
    const applyImpulse = (dot: Dot, pushX: number, pushY: number, duration = returnDuration) => {
      if (dot.active) return;
      dot.active = true;
      gsap.killTweensOf(dot);
      gsap
        .timeline({
          onComplete: () => {
            dot.active = false;
          },
        })
        .to(dot, {
          xOffset: pushX,
          yOffset: pushY,
          duration: Math.max(0.16, 320 / resistance),
          ease: "power3.out",
        })
        .to(dot, {
          xOffset: 0,
          yOffset: 0,
          duration,
          ease: "elastic.out(1, 0.72)",
        });
    };

    const onMove = (event: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const now = performance.now();
      const pointer = pointerRef.current;
      const dt = pointer.lastTime ? now - pointer.lastTime : 16;
      const dx = event.clientX - pointer.lastX;
      const dy = event.clientY - pointer.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.vx = vx;
      pointer.vy = vy;
      pointer.speed = speed;
      pointer.lastTime = now;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;

      if (speed < speedTrigger) return;

      for (const dot of dotsRef.current) {
        const distance = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y);
        if (distance < proximity) {
          const force = 1 - distance / proximity;
          const pushX = (dot.cx - pointer.x) * force * 0.12 + vx * 0.004 * force;
          const pushY = (dot.cy - pointer.y) * force * 0.12 + vy * 0.004 * force;
          applyImpulse(dot, pushX, pushY, returnDuration);
        }
      }
    };

    const onClick = (event: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const cx = event.clientX - rect.left;
      const cy = event.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const distance = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (distance < shockRadius) {
          const falloff = Math.max(0, 1 - distance / shockRadius);
          applyImpulse(
            dot,
            (dot.cx - cx) * shockStrength * falloff,
            (dot.cy - cy) * shockStrength * falloff,
            returnDuration * 1.1,
          );
        }
      }
    };

    const throttledMove = throttle(onMove, 34);
    window.addEventListener("pointermove", throttledMove, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });

    return () => {
      window.removeEventListener("pointermove", throttledMove);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [
    maxSpeed,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
    speedTrigger,
  ]);

  return (
    <section className={`dot-grid ${className}`} style={style} aria-hidden="true">
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
}

export default DotGrid;
