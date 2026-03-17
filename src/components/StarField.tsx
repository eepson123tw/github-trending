"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  opacity: number;
  speed: number;
  hue: number;
}

const CATEGORY_HUES = [220, 270, 160, 40, 340]; // blue, purple, green, amber, rose

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create stars
    const count = Math.min(200, Math.floor(window.innerWidth * 0.12));
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 2 + 0.5,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      hue: CATEGORY_HUES[Math.floor(Math.random() * CATEGORY_HUES.length)],
    }));

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const star of starsRef.current) {
        // Parallax drift
        star.y += star.speed;
        if (star.y > canvas.height + 10) {
          star.y = -10;
          star.x = Math.random() * canvas.width;
        }

        // Mouse repel
        const dx = star.x - mx;
        const dy = star.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 120;
        let drawX = star.x;
        let drawY = star.y;
        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 30;
          drawX += (dx / dist) * force;
          drawY += (dy / dist) * force;
        }

        // Twinkle
        const twinkle =
          Math.sin(Date.now() * 0.002 * star.speed + star.x) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;

        // Draw glow
        const gradient = ctx.createRadialGradient(
          drawX,
          drawY,
          0,
          drawX,
          drawY,
          star.radius * star.z * 3
        );
        gradient.addColorStop(
          0,
          `hsla(${star.hue}, 80%, 75%, ${alpha})`
        );
        gradient.addColorStop(1, `hsla(${star.hue}, 80%, 75%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius * star.z * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${star.hue}, 80%, 90%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw faint connection lines between nearby stars
      for (let i = 0; i < starsRef.current.length; i++) {
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const a = starsRef.current[i];
          const b = starsRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
