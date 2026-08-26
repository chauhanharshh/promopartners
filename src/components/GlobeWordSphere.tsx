"use client";

import React, { useEffect, useRef } from 'react';

interface ElementItem {
  el: HTMLDivElement;
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  px: number;
  py: number;
  z: number;
  opacity: number;
}

export default function GlobeWordSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const globeContainer = containerRef.current;
    const canvas = canvasRef.current;
    if (!globeContainer || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = globeContainer.clientWidth || 320;
    let height = globeContainer.clientHeight || 320;
    
    // Set initial canvas dimensions
    canvas.width = width;
    canvas.height = height;

    const words = [
      'BRANDING', 'SEO', 'CAMPAIGNS', 'INFLUENCER',
      'MARKETING', 'PR & MEDIA', 'CONTENT', 'STRATEGY',
      'SOCIAL MEDIA', 'PERFORMANCE', 'PHOTOSHOOTS',
      'VIDEOSHOOTS', 'GROWTH', 'VISIBILITY', 'IDENTITY',
      'DIGITAL', 'ADS', 'ROI', 'OUTREACH', 'STORYTELLING'
    ];

    let radius = Math.max(Math.min(width, height) / 2 * 0.85, 100); // Dynamic radius based on container, safeguard against 0
    const elements: ElementItem[] = [];

    // Distribute points on a sphere (Fibonacci lattice)
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

    // Clear previous children just in case
    globeContainer.querySelectorAll('.globe-word').forEach(el => el.remove());

    words.forEach((word, i) => {
      const el = document.createElement('div');
      el.className = 'globe-word';
      el.innerText = word;
      globeContainer.appendChild(el);

      const y = 1 - (i / (words.length - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Store normalized coordinates, scale by radius during render
      elements.push({
        el: el,
        x: x,
        y: y,
        z: z
      });
    });

    let rotationY = 0;
    let rotationX = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isHovered = false;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let animationFrameId: number;

    const updatePositions = () => {
      if (!isHovered && !isDragging) {
        targetRotationY -= 0.003; // Auto rotate smooth, continuous, slow
      }

      // Smoothly interpolate rotation
      rotationY += (targetRotationY - rotationY) * 0.1;
      rotationX += (targetRotationX - rotationX) * 0.1;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const projectedPoints: ProjectedPoint[] = [];

      elements.forEach(item => {
        // Scale normalized vectors by dynamic radius
        const currentRadius = radius;
        const ix = item.x * currentRadius;
        const iy = item.y * currentRadius;
        const iz = item.z * currentRadius;

        // Rotate around Y
        const x1 = ix * cosY - iz * sinY;
        const z1 = iz * cosY + ix * sinY;
        const y1 = iy;

        // Rotate around X
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = z1 * cosX + y1 * sinX;

        // Map depth to scale, font-size and opacity
        const scale = (z2 + currentRadius) / (2 * currentRadius); // 0 (back) to 1 (front)

        // Dynamic font size scaling
        const baseFontSize = width < 500 ? 8 : 12;
        const maxFontSizeAdd = width < 500 ? 5 : 8;
        const fontSize = baseFontSize + scale * maxFontSizeAdd; 
        const opacity = 0.3 + scale * 0.7; // 30% back, 100% front

        const px = canvas.width / 2 + x1; 
        const py = canvas.height / 2 + y2;

        projectedPoints.push({
          px, py, z: z2, opacity
        });

        item.el.style.transform = `translate3d(${x1}px, ${y2}px, ${z2}px) translate(-50%, -50%) scale(${scale * 0.5 + 0.8})`;
        item.el.style.fontSize = `${fontSize}px`;
        item.el.style.opacity = opacity.toString();
        item.el.style.zIndex = (Math.round(scale * 100) + 10).toString();

        // Slightly faded gold on the back half
        item.el.style.color = opacity < 0.6 ? '#b08a1b' : '#C9A227';
      });

      // Draw connecting lines between nearby points
      ctx.lineWidth = 0.5;
      const connectionDistance = radius * 1.1; // adjust distance threshold as needed

      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[j];

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dz = p1.z - p2.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < connectionDistance) {
            // Opacity depends on depth, capped to 0.2 max as per spec
            const lineOpacity = (p1.opacity + p2.opacity) / 2 * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(201, 162, 39, ${lineOpacity})`;
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    updatePositions();

    const handleResize = () => {
      width = globeContainer.clientWidth || 320;
      height = globeContainer.clientHeight || 320;
      canvas.width = width;
      canvas.height = height;
      radius = Math.max(Math.min(width, height) / 2 * 0.85, 100);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(globeContainer);

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => {
      isHovered = false;
      isDragging = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => { isDragging = false; };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => { isDragging = false; };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    window.addEventListener('resize', handleResize);
    globeContainer.addEventListener('mouseenter', handleMouseEnter);
    globeContainer.addEventListener('mouseleave', handleMouseLeave);
    globeContainer.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    globeContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      globeContainer.removeEventListener('mouseenter', handleMouseEnter);
      globeContainer.removeEventListener('mouseleave', handleMouseLeave);
      globeContainer.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);

      globeContainer.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      id="globe-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        aspectRatio: '1 / 1',
        margin: '0 auto',
        perspective: '1000px',
        userSelect: 'none',
        cursor: 'grab'
      }}
    >
      <canvas 
        ref={canvasRef} 
        id="globe-canvas" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
