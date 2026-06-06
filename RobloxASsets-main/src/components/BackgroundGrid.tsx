/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

export default function BackgroundGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCoords({ x, y });
        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      id="bg-grid-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Animated Subtle Ambient Radial Gradient */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 opacity-65"
        style={{
          background: `radial-gradient(circle 350px at ${coords.x}px ${coords.y}px, rgba(37, 99, 235, 0.09) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 100%)`
        }}
      />
      
      {/* Sharper follower spotlight for the interactive mouse effect */}
      <div 
        className="absolute inset-0 transition-opacity duration-150 opacity-80"
        style={{
          background: `radial-gradient(circle 120px at ${coords.x}px ${coords.y}px, rgba(56, 189, 248, 0.12), transparent 100%)`
        }}
      />

      {/* Static grid background */}
      <div className="absolute inset-0 grid-bg opacity-45" />

      {/* Subtle flat dark base layers represent clean premium depth */}
      <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-blue-950/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-950/5 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
}
