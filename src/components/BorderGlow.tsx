import {
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import "./BorderGlow.css";

type GlowStyle = CSSProperties & Record<`--${string}`, string | number>;

type BorderGlowProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
};

const gradientPositions = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const gradientKeys = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
] as const;
const colorMap = [0, 1, 2, 0, 1, 2, 1];

function parseHsl(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);

  if (!match) {
    return { h: 189, s: 86, l: 65 };
  }

  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
}

function buildGlowVars(glowColor: string, intensity: number): GlowStyle {
  const { h, s, l } = parseHsl(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: GlowStyle = {};

  opacities.forEach((opacity, index) => {
    vars[`--glow-color${keys[index]}`] = `hsl(${base} / ${Math.min(opacity * intensity, 100)}%)`;
  });

  return vars;
}

function buildGradientVars(colors: string[]): GlowStyle {
  const vars: GlowStyle = {};

  gradientKeys.forEach((key, index) => {
    const color = colors[Math.min(colorMap[index], colors.length - 1)];
    vars[key] = `radial-gradient(at ${gradientPositions[index]}, ${color} 0px, transparent 50%)`;
  });
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;

  return vars;
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x: number) {
  return x * x * x;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (value: number) => number;
  onUpdate: (value: number) => void;
  onEnd?: () => void;
}) {
  let frameId = 0;
  const timeoutId = window.setTimeout(() => {
    const startTime = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      onUpdate(start + (end - start) * ease(progress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      onEnd?.();
    };

    frameId = window.requestAnimationFrame(tick);
  }, delay);

  return () => {
    window.clearTimeout(timeoutId);
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }
  };
}

function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "189 86 65",
  backgroundColor = "rgba(23, 23, 34, 0.62)",
  borderRadius = 8,
  glowRadius = 42,
  glowIntensity = 0.92,
  coneSpread = 24,
  animated = false,
  colors = ["#8B5CF6", "#6366F1", "#22D3EE"],
  fillOpacity = 0.32,
  style,
  onPointerMove,
  ...restProps
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
      const ky = dy === 0 ? Infinity : cy / Math.abs(dy);

      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [getCenterOfElement],
  );

  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;

      if (dx === 0 && dy === 0) {
        return 0;
      }

      const radians = Math.atan2(dy, dx);
      const degrees = radians * (180 / Math.PI) + 90;

      return degrees < 0 ? degrees + 360 : degrees;
    },
    [getCenterOfElement],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);

      const card = cardRef.current;
      if (!card) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);

      card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
      card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
    },
    [getCursorAngle, getEdgeProximity, onPointerMove],
  );

  useEffect(() => {
    if (!animated || !cardRef.current) {
      return undefined;
    }

    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    const cancelAnimations: Array<() => void> = [];

    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);

    cancelAnimations.push(
      animateValue({
        duration: 500,
        onUpdate: (value) => card.style.setProperty("--edge-proximity", value.toString()),
      }),
      animateValue({
        ease: easeInCubic,
        duration: 1500,
        end: 50,
        onUpdate: (value) => {
          card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
        },
      }),
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        onUpdate: (value) => {
          card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
        },
      }),
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        onUpdate: (value) => card.style.setProperty("--edge-proximity", value.toString()),
        onEnd: () => card.classList.remove("sweep-active"),
      }),
    );

    return () => {
      cancelAnimations.forEach((cancel) => cancel());
      card.classList.remove("sweep-active");
    };
  }, [animated]);

  const glowStyle = useMemo(
    () =>
      ({
        "--card-bg": backgroundColor,
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        "--cone-spread": coneSpread,
        "--fill-opacity": fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
        ...style,
      }) as GlowStyle,
    [backgroundColor, borderRadius, colors, coneSpread, edgeSensitivity, fillOpacity, glowColor, glowIntensity, glowRadius, style],
  );

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className}`.trim()}
      style={glowStyle}
      onPointerMove={handlePointerMove}
      {...restProps}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}

export default BorderGlow;
