import React, { useEffect, useRef, useState } from "react";
import "../styles/CustomCursor.css";

export default function LiquidCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const trailRefs = useRef([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    let animationFrameId;
    let lastX = 0;
    let lastY = 0;
    let velocity = { x: 0, y: 0 };

    const moveCursor = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Calculate velocity for dynamic effects
      velocity.x = x - lastX;
      velocity.y = y - lastY;
      lastX = x;
      lastY = y;

      setMousePos({ x, y });

      if (cursorRef.current) {
        // Smooth elastic movement
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${x}px`;
        cursorDotRef.current.style.top = `${y}px`;
      }

      // Add trail effect
      addTrail(x, y, velocity);
    };

    const addTrail = (x, y, vel) => {
      const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2);
      
      if (speed > 2) {
        setTrails((prev) => [
          ...prev.slice(-15), // Keep last 15 trails
          {
            id: Date.now() + Math.random(),
            x,
            y,
            size: Math.min(speed * 0.5, 30),
          },
        ]);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      createRipple(mousePos.x, mousePos.y);
    };

    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      if (
        e.target.closest(
          "button, a, .modern-card, .item-card, .nav-link, input, textarea, [role='button']"
        )
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const createRipple = (x, y) => {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      document.body.appendChild(ripple);

      setTimeout(() => ripple.remove(), 800);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    // Cleanup trails periodically
    const trailCleanup = setInterval(() => {
      setTrails((prev) => prev.slice(-10));
    }, 100);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      clearInterval(trailCleanup);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`liquid-cursor ${isHovered ? "hovered" : ""} ${
          isClicking ? "clicking" : ""
        }`}
      >
        <div className="cursor-inner"></div>
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={`cursor-dot ${isClicking ? "clicking" : ""}`}
      ></div>

      {/* Particle trails */}
      {trails.map((trail) => (
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