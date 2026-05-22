"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'power3.out',
  scrollStart = 'top bottom-=10%',
  scrollEnd = 'bottom center+=10%',
  stagger = 0.02
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      <span className="char" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const charElements = el.querySelectorAll('.char');
    
    // Set initial custom styles to prevent layout shifts
    gsap.set(charElements, { display: 'inline-block' });

    const tween = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        y: '50px',
        scaleY: 1.2,
        scaleX: 0.9,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        y: '0px',
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: 1.2 // High quality easing/damping on scroll catch-up
        }
      }
    );

    return () => {
      tween.kill();
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill();
      }
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <h2 ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
