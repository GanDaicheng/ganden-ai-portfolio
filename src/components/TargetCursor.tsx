import { useCallback, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import "./TargetCursor.css";

type TargetCursorProps = {
  targetSelector?: string;
  activeAreaSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
};

type CornerPosition = {
  x: number;
  y: number;
};

const getContainingBlock = (element: HTMLElement | null) => {
  let node = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== "none" ||
      style.perspective !== "none" ||
      style.filter !== "none" ||
      style.willChange.includes("transform") ||
      style.willChange.includes("perspective") ||
      style.willChange.includes("filter") ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null) => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

function isTouchDevice() {
  if (typeof window === "undefined") return true;
  return ("ontouchstart" in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
}

export default function TargetCursor({
  targetSelector = ".cursor-target",
  activeAreaSelector,
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = "#ffffff",
  cursorColorOnTarget,
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);
  const targetCornerPositionsRef = useRef<CornerPosition[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });
  const isMobile = useMemo(() => isTouchDevice(), []);
  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, {
      x: x - offsetX,
      y: y - offsetY,
      duration: 0.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) document.body.style.cursor = "none";

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner");
    containingBlockRef.current = getContainingBlock(cursor);

    let activeTarget: HTMLElement | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: number | null = null;

    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);
    const cleanupTarget = (target: HTMLElement) => {
      if (currentLeaveHandler) target.removeEventListener("mouseleave", currentLeaveHandler);
      currentLeaveHandler = null;
    };

    const initialOffset = getOffset();
    gsap.set(cursor, {
      autoAlpha: 0,
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y,
    });

    const createSpinTimeline = () => {
      spinTl.current?.kill();
      spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, { rotation: "+=360", duration: spinDuration, ease: "none" });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) return;
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cursorX = Number(gsap.getProperty(cursorRef.current, "x"));
      const cursorY = Number(gsap.getProperty(cursorRef.current, "y"));

      Array.from(cornersRef.current).forEach((corner, index) => {
        const currentX = Number(gsap.getProperty(corner, "x"));
        const currentY = Number(gsap.getProperty(corner, "y"));
        const targetX = targetCornerPositionsRef.current![index].x - cursorX;
        const targetY = targetCornerPositionsRef.current![index].y - cursorY;
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: currentX + (targetX - currentX) * strength,
          y: currentY + (targetY - currentY) * strength,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const showCursor = () => gsap.to(cursor, { autoAlpha: 1, duration: 0.16, ease: "power2.out" });
    const hideCursor = () => gsap.to(cursor, { autoAlpha: 0, duration: 0.18, ease: "power2.out" });

    const moveHandler = (event: MouseEvent) => {
      moveCursor(event.clientX, event.clientY);

      if (!activeAreaSelector || activeTarget) return;
      const insideActiveArea = Boolean((event.target as HTMLElement | null)?.closest(activeAreaSelector));
      if (insideActiveArea) {
        showCursor();
      } else {
        hideCursor();
      }
    };
    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX = Number(gsap.getProperty(cursorRef.current, "x")) + offsetX;
      const mouseY = Number(gsap.getProperty(cursorRef.current, "y")) + offsetY;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const stillOver =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!stillOver && currentLeaveHandler) currentLeaveHandler();
    };

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursor, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    const enterHandler = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(targetSelector);
      if (!target || !cursorRef.current || !cornersRef.current || activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) window.clearTimeout(resumeTimeout);

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      showCursor();
      gsap.killTweensOf(corners, "x,y");
      gsap.killTweensOf(cursor, "rotation");
      spinTl.current?.pause();
      gsap.set(cursor, { rotation: 0 });

      if (cursorColorOnTarget) {
        gsap.to(corners, { borderColor: cursorColorOnTarget, duration: 0.15, ease: "power2.out" });
        if (dotRef.current) gsap.to(dotRef.current, { backgroundColor: cursorColorOnTarget, duration: 0.15, ease: "power2.out" });
      }

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = Number(gsap.getProperty(cursor, "x"));
      const cursorY = Number(gsap.getProperty(cursor, "y"));

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
      ];

      if (tickerFnRef.current) gsap.ticker.add(tickerFnRef.current);
      gsap.to(activeStrengthRef.current, { current: 1, duration: hoverDuration, ease: "power2.out" });
      corners.forEach((corner, index) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![index].x - cursorX,
          y: targetCornerPositionsRef.current![index].y - cursorY,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const leaveHandler = () => {
        if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;
        const elementUnderMouse = document.elementFromPoint(
          Number(gsap.getProperty(cursor, "x")) + getOffset().x,
          Number(gsap.getProperty(cursor, "y")) + getOffset().y,
        );
        if (!activeAreaSelector || !elementUnderMouse?.closest(activeAreaSelector)) {
          hideCursor();
        }

        if (cursorColorOnTarget && cornersRef.current) {
          gsap.to(Array.from(cornersRef.current), { borderColor: cursorColor, duration: 0.15, ease: "power2.out" });
          if (dotRef.current) gsap.to(dotRef.current, { backgroundColor: cursorColor, duration: 0.15, ease: "power2.out" });
        }

        if (cornersRef.current) {
          const positions = [
            { x: -constants.cornerSize * 1.5, y: -constants.cornerSize * 1.5 },
            { x: constants.cornerSize * 0.5, y: -constants.cornerSize * 1.5 },
            { x: constants.cornerSize * 0.5, y: constants.cornerSize * 0.5 },
            { x: -constants.cornerSize * 1.5, y: constants.cornerSize * 0.5 },
          ];
          Array.from(cornersRef.current).forEach((corner, index) => {
            gsap.to(corner, { ...positions[index], duration: 0.3, ease: "power3.out" });
          });
        }

        resumeTimeout = window.setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) createSpinTimeline();
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener("mouseleave", leaveHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseover", enterHandler);
    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("resize", () => {
      containingBlockRef.current = getContainingBlock(cursor);
    });
    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseover", enterHandler);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      if (activeTarget) cleanupTarget(activeTarget);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current.current = 0;
    };
  }, [
    constants,
    cursorColor,
    cursorColorOnTarget,
    activeAreaSelector,
    hideDefaultCursor,
    hoverDuration,
    isMobile,
    moveCursor,
    parallaxOn,
    spinDuration,
    targetSelector,
  ]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current || !spinTl.current.isActive()) return;
    spinTl.current.kill();
    spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, { rotation: "+=360", duration: spinDuration, ease: "none" });
  }, [spinDuration, isMobile]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <div className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>
  );
}
