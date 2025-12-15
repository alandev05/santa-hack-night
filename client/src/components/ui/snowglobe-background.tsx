
import React, { useEffect, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
  opacity: number;
}

export function SnowglobeBackground({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let snowflakes: Snowflake[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createSnowflakes = () => {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 10000); // Density
      snowflakes = [];
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          wind: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw smooth gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1a4c4c"); // Deep green/blue top
      gradient.addColorStop(1, "#8f3333"); // Reddish bottom for festive contrast

      // Or let's try a radial gradient for a "globe" feel
      // const gradient = ctx.createRadialGradient(
      //   canvas.width / 2, canvas.height / 2, 0,
      //   canvas.width / 2, canvas.height / 2, canvas.width
      // );
      // gradient.addColorStop(0, "#2c5282"); // Center blueish
      // gradient.addColorStop(1, "#1a202c"); // Dark edges

      // Let's stick to CSS for the background color so we can tune it easily, 
      // and use canvas just for snow.
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      
      snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        // Update position
        flake.y += flake.speed;
        flake.x += flake.wind;

        // Reset if out of bounds
        if (flake.y > canvas.height) {
          flake.y = -5;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    createSnowflakes();
    draw();

    window.addEventListener("resize", () => {
      resize();
      createSnowflakes();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Gradient Layer */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-red-900 via-green-900 to-slate-900 opacity-90" />
      
      {/* Snow Layer */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Content Layer with Glass Effect Wrapper */}
      <div className="relative z-10 min-h-screen">
         {/* We wrap the content in a container to give it structure if needed, 
             but for now just passing children so they overlay the snow */}
         {children}
      </div>
    </div>
  );
}
