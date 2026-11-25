// @ts-nocheck
import { useEffect, useRef } from 'react';

export default function CanvasCursor() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 }); // Start off-screen

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    let animationFrameId;
    let rotation = 0; // Tracks current spin angle in radians

    // 1. Match canvas resolution to screen size (accounting for Retina/high-DPI)
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // 2. Track mouse coordinates without triggering React re-renders
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // 3. Render loop
    const render = () => {
      // Clear previous frame (keeps background completely transparent)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Advance the spin angle every frame (adjust 0.05 for faster/slower spin)
      rotation = (rotation + 0.05) % (Math.PI * 2);

      // Pass `rotation` as the starting angle of the conic gradient
      const gradient = ctx.createConicGradient(rotation, mouse.current.x, mouse.current.y);
      gradient.addColorStop(0, '#ff004c');    // Red
      gradient.addColorStop(0.17, '#ff7b00'); // Orange
      gradient.addColorStop(0.33, '#ffe600'); // Yellow
      gradient.addColorStop(0.5, '#00ff66');  // Green
      gradient.addColorStop(0.67, '#00ccff'); // Cyan
      gradient.addColorStop(0.83, '#7b2cff'); // Violet
      gradient.addColorStop(1, '#ff004c');    // Loop seamlessly back to Red

      // Draw your custom hollow rainbow ring
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Crucial: lets clicks pass through to your app
        zIndex: 9999,
      }}
    />
  );
}
