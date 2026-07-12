import { forwardRef, type CSSProperties, type RefObject, useEffect, useMemo, useRef } from "react";
import "./VariableProximity.css";

type Falloff = "linear" | "exponential" | "gaussian";

type VariableProximityProps = {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef?: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: Falloff;
  className?: string;
  style?: CSSProperties;
};

function parseSettings(settings: string) {
  return new Map(
    settings
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [name, value] = item.split(/\s+/);
        return [name.replace(/['"]/g, ""), Number.parseFloat(value)] as const;
      }),
  );
}

function getFalloff(distance: number, radius: number, falloff: Falloff) {
  const norm = Math.min(Math.max(1 - distance / radius, 0), 1);

  if (falloff === "exponential") {
    return norm ** 2;
  }

  if (falloff === "gaussian") {
    return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
  }

  return norm;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>(
  (
    {
      label,
      fromFontVariationSettings,
      toFontVariationSettings,
      containerRef,
      radius = 96,
      falloff = "linear",
      className = "",
      style,
    },
    ref,
  ) => {
    const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const mouseRef = useRef({ x: -10000, y: -10000 });
    const lastRef = useRef({ x: Number.NaN, y: Number.NaN });
    const words = useMemo(() => label.split(" "), [label]);

    const axes = useMemo(() => {
      const from = parseSettings(fromFontVariationSettings);
      const to = parseSettings(toFontVariationSettings);

      return Array.from(from.entries()).map(([axis, fromValue]) => ({
        axis,
        fromValue,
        toValue: to.get(axis) ?? fromValue,
      }));
    }, [fromFontVariationSettings, toFontVariationSettings]);

    useEffect(() => {
      const updatePosition = (clientX: number, clientY: number) => {
        const container = containerRef?.current;
        if (!container) {
          mouseRef.current = { x: clientX, y: clientY };
          return;
        }

        const rect = container.getBoundingClientRect();
        mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top };
      };

      const onMove = (event: MouseEvent) => updatePosition(event.clientX, event.clientY);
      const onTouch = (event: TouchEvent) => {
        const touch = event.touches[0];
        if (touch) {
          updatePosition(touch.clientX, touch.clientY);
        }
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onTouch);
      };
    }, [containerRef]);

    useEffect(() => {
      let frameId = 0;

      const tick = () => {
        const container = containerRef?.current;
        if (!container) {
          frameId = requestAnimationFrame(tick);
          return;
        }

        const { x, y } = mouseRef.current;
        if (lastRef.current.x === x && lastRef.current.y === y) {
          frameId = requestAnimationFrame(tick);
          return;
        }

        lastRef.current = { x, y };
        const containerRect = container.getBoundingClientRect();

        letterRefs.current.forEach((letter) => {
          if (!letter) {
            return;
          }

          const rect = letter.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2 - containerRect.left;
          const centerY = rect.top + rect.height / 2 - containerRect.top;
          const distance = Math.hypot(x - centerX, y - centerY);
          const strength = distance >= radius ? 0 : getFalloff(distance, radius, falloff);

          const variation = axes
            .map(({ axis, fromValue, toValue }) => "'" + axis + "' " + (fromValue + (toValue - fromValue) * strength))
            .join(", ");

          letter.style.fontVariationSettings = variation;
          letter.style.fontWeight = String(Math.round(520 + strength * 310));
          letter.style.color =
            strength > 0.03 ? "rgb(" + (235 - strength * 8) + ", " + (240 + strength * 10) + ", 255)" : "";
          letter.style.textShadow =
            strength > 0.03
              ? "0 0 " +
                (8 + strength * 18) +
                "px rgba(34, 211, 238, " +
                (0.08 + strength * 0.32) +
                "), 0 0 " +
                (18 + strength * 32) +
                "px rgba(139, 92, 246, " +
                (0.08 + strength * 0.2) +
                ")"
              : "";
          letter.style.transform =
            "translate3d(0, " + -strength * 3.5 + "px, 0) scaleY(" + (1 + strength * 0.045) + ")";
        });

        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frameId);
    }, [axes, containerRef, falloff, fromFontVariationSettings, radius]);

    let letterIndex = 0;

    return (
      <span ref={ref} className={"variable-proximity " + className} style={style}>
        {words.map((word, wordIndex) => (
          <span className="variable-proximity__word" key={word + "-" + wordIndex}>
            {Array.from(word).map((letter) => {
              const currentIndex = letterIndex;
              letterIndex += 1;

              return (
                <span
                  aria-hidden="true"
                  className="variable-proximity__letter"
                  key={currentIndex}
                  ref={(element) => {
                    letterRefs.current[currentIndex] = element;
                  }}
                  style={{ fontVariationSettings: fromFontVariationSettings }}
                >
                  {letter}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span aria-hidden="true" className="variable-proximity__space">
                &nbsp;
              </span>
            )}
          </span>
        ))}
        <span className="sr-only">{label}</span>
      </span>
    );
  },
);

VariableProximity.displayName = "VariableProximity";

export default VariableProximity;
