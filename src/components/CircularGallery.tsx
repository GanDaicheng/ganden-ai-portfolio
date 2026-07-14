import { type ReactNode, useEffect, useRef } from "react";
import "./CircularGallery.css";

type CircularGalleryProps = {
  children: ReactNode;
  className?: string;
  bend?: number;
  scrollEase?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function CircularGallery({
  children,
  className,
  bend = 26,
  scrollEase = 0.08,
}: CircularGalleryProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startTarget: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let frame = 0;

    const getLimits = () => {
      const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
      return { min: -overflow, max: 0 };
    };

    const updateItems = () => {
      const viewportRect = viewport.getBoundingClientRect();
      const viewportCenter = viewportRect.left + viewportRect.width / 2;
      const items = Array.from(track.children) as HTMLElement[];

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const normalized = clamp((itemCenter - viewportCenter) / viewportRect.width, -1.1, 1.1);
        const depth = 1 - Math.min(1, Math.abs(normalized));

        item.style.setProperty("--gallery-rotate", `${normalized * -bend}deg`);
        item.style.setProperty("--gallery-y", `${Math.abs(normalized) * 42}px`);
        item.style.setProperty("--gallery-scale", `${0.9 + depth * 0.1}`);
        item.style.setProperty("--gallery-opacity", `${0.55 + depth * 0.45}`);
      });
    };

    const animate = () => {
      const limits = getLimits();
      targetRef.current = clamp(targetRef.current, limits.min, limits.max);
      currentRef.current += (targetRef.current - currentRef.current) * scrollEase;
      track.style.transform = `translate3d(${currentRef.current}px, 0, 0)`;
      updateItems();
      frame = requestAnimationFrame(animate);
    };

    const handlePointerDown = (event: PointerEvent) => {
      dragRef.current = { active: true, startX: event.clientX, startTarget: targetRef.current };
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("is-dragging");
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      targetRef.current = dragRef.current.startTarget + (event.clientX - dragRef.current.startX);
    };

    const stopDrag = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      viewport.classList.remove("is-dragging");
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    };

    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", stopDrag);
    viewport.addEventListener("pointercancel", stopDrag);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerup", stopDrag);
      viewport.removeEventListener("pointercancel", stopDrag);
    };
  }, [bend, scrollEase]);

  return (
    <div className={`circular-gallery ${className ?? ""}`} ref={viewportRef}>
      <div className="circular-gallery__track" ref={trackRef}>
        {children}
      </div>
    </div>
  );
}
