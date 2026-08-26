"use client";

import React, { useEffect, useRef } from 'react';
import './DomeGallery.css';
import DomeGallery from './DomeGallery';

interface DomeGalleryWrapperProps {
  images: { src: string; alt: string; }[];
  options?: any;
  height?: string;
}

export default function DomeGalleryWrapper({ images, options, height }: DomeGalleryWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Instantiate DomeGallery
    instanceRef.current = new (DomeGallery as any)(containerRef.current, images, options);

    return () => {
      // Clean up if necessary
      if (instanceRef.current) {
        if (instanceRef.current.ro) {
          instanceRef.current.ro.disconnect();
        }
        if (instanceRef.current.autoRotateId) {
          cancelAnimationFrame(instanceRef.current.autoRotateId);
        }
        if (instanceRef.current.inertiaRAF) {
          cancelAnimationFrame(instanceRef.current.inertiaRAF);
        }
      }
      // Remove scroll lock class just in case
      document.body.classList.remove('dg-scroll-lock');
    };
  }, [images, options]);

  return (
    <div
      ref={containerRef}
      id="dome-gallery-container"
      style={{
        position: 'relative',
        width: '100%',
        height: height || '800px',
        overflow: 'hidden',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        background: '#F5F0E8'
      }}
    />
  );
}
