/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function Cursor() {
  const [cursorText, setCursorText] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor interpolation
  const springConfig = { damping: 30, stiffness: 350, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Find if we are hovering over an item requesting a custom cursor label
      let target = e.target as HTMLElement | null;
      let label = '';
      let hoveredType = false;

      while (target) {
        if (target.getAttribute) {
          const attributeVal = target.getAttribute('data-cursor');
          if (attributeVal) {
            label = attributeVal;
            hoveredType = true;
            break;
          }
          // Default labels for standard interactive tags for consistent feedback
          const tagName = target.tagName;
          if (tagName === 'A' || tagName === 'BUTTON' || target.classList.contains('cursor-pointer')) {
            hoveredType = true;
          }
        }
        target = target.parentElement;
      }

      setCursorText(label);
      setIsHovered(hoveredType);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't show cursor on touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
  }, []);

  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      id="custom-cursor"
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference flex items-center justify-center font-mono text-[9px] uppercase tracking-widest text-[#fafafa] rounded-full"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        width: isHovered ? (cursorText ? '56px' : '36px') : '10px',
        height: isHovered ? (cursorText ? '56px' : '36px') : '10px',
        backgroundColor: '#fafafa',
        border: '1px solid #fafafa',
        // Invert back to solid visual or ring visual depending on label
        background: cursorText ? '#fafafa' : (isHovered ? 'transparent' : '#fafafa'),
        color: '#0d0d0d'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      {cursorText && (
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-bold text-center select-none"
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}
