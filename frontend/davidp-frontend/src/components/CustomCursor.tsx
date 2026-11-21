// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

// Exact hotspot [x, y] coordinates on the original 32x32 image
const HOTSPOTS = {
  default:[0,0],     // Top-left arrow tip
  pointer:[7.25,0],     // Index fingertip
  text:[4.5,8.5],      // Center of I-beam
  forbidden:[0,0], // Center of circle
  help:[0,0],        // Top-left arrow tip
  cross:[0,0],     // Center of crosshair
  pencil:[0,0],     // Bottom-left pencil tip
  move:[0,0],      // Center of 4-way arrow
};

export default function CustomCursor({ scale = 1.75 }) {
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorTypeRef = useRef('default');

  const [cursorType, setCursorType] = useState('default');
  const [isVisible, setIsVisible] = useState(false);

  // Update transform immediately whenever cursorType or scale changes
  useEffect(() => {
    cursorTypeRef.current = cursorType;
    const cursorEl = cursorRef.current;
    if (cursorEl) {
      const [hx, hy] = HOTSPOTS[cursorType] || [0,0];
      const { x, y } = mousePos.current;
      cursorEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) translate3d(${-hx}px, ${-hy}px, 0)`;
    }
  }, [cursorType, scale]);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    const handlePointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      mousePos.current = { x, y };

      // Update GPU transform immediately—no requestAnimationFrame delay
      const [hx, hy] = HOTSPOTS[cursorTypeRef.current] || [0,0];
      cursorEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) translate3d(${-hx}px, ${-hy}px, 0)`;

      if (!isVisible) setIsVisible(true);
    };

    const handlePointerOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      if (target.closest(':disabled, [disabled], [aria-disabled="true"], .forbidden')) {
        setCursorType('forbidden');
      } else if (
        target.closest(
          'a, button, [role="button"], select, label, summary, input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"]'
        )
      ) {
        setCursorType('pointer');
      } else if (
        target.closest(
          'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="number"], textarea, p, span, h1, h2, h3, h4, h5, h6, li, code, pre'
        )
      ) {
        setCursorType('text');
      } else if (target.closest('[draggable="true"], .cursor-move')) {
        setCursorType('move');
      } else if (target.closest('[title], .cursor-help')) {
        setCursorType('help');
      } else if (target.closest('.cursor-crosshair')) {
        setCursorType('cross');
      } else if (target.closest('.cursor-pencil')) {
        setCursorType('pencil');
      } else {
        setCursorType('default');
      }
    };

    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [scale, isVisible]);

  const activeClass = cursorType !== 'default' ? styles[cursorType] : '';

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${activeClass}`}
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}