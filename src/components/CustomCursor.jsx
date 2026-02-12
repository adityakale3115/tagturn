import React, { useEffect, useRef, useState } from "react";
import "../styles/CustomCursor.css";

export default function LiquidCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);
  const [isTouchActive, setIsTouchActive] = useState(false);

  const isMobile =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    if (isMobile) return; // ❌ Skip mouse logic on mobile

    let lastX = 0;
    let lastY = 0;
    let velocity = { x: 0, y: 0 };

    const moveCursor = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      velocity.x = x - lastX;
      velocity.y = y - lastY;
      lastX = x;
      lastY = y;

      setMousePos({ x, y });

      cursorRef.current.style.left = `${x}px`;
      cursorRef.current.style.top = `${y}px`;
      cursorDotRef.current.style.left = `${x}px`;
      cursorDotRef.current.style.top = `${y}px`;

      const speed = Math.hypot(velocity.x, velocity.y);
      if (speed > 2) {
        setTrails((prev) => [
          ...prev.slice(-15),
          {
            id: Date.now() + Math.random(),
            x,
            y,
            size: Math.min(speed * 0.5, 30),
          },
        ]);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      setIsHovered(
        !!e.target.closest(
          "button, a, input, textarea, [role='button']"
        )
      );
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isMobile]);

  // ✅ Mobile: show cursor ONLY while touching
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      setMousePos({ x: touch.clientX, y: touch.clientY });
      setIsTouchActive(true);
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      setMousePos({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = () => setIsTouchActive(false);

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile]);

  // ❌ Hide completely on mobile unless touching
  if (isMobile && !isTouchActive) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`liquid-cursor ${isHovered ? "hovered" : ""} ${
          isClicking ? "clicking" : ""
        }`}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      >
        <div className="cursor-inner" />
      </div>

      <div
        ref={cursorDotRef}
        className="cursor-dot"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {!isMobile &&
        trails.map((trail) => (
          <div
            key={trail.id}
            className="cursor-trail"
            style={{
              left: `${trail.x}px`,
              top: `${trail.y}px`,
              width: `${trail.size}px`,
              height: `${trail.size}px`,
            }}
          />
        ))}
    </>
  );
}
