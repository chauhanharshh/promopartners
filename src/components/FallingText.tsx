"use client";

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './FallingText.css';

interface FallingTextProps {
  text?: string;
  highlightWords?: string[];
  highlightClass?: string;
  trigger?: 'hover' | 'click' | string;
  effectStarted?: boolean;
  gravity?: number;
  fontSize?: string;
  backgroundColor?: string;
  mouseConstraintStiffness?: number;
  onReset?: (() => void) | null;
}

interface WordSpan {
  element: HTMLSpanElement;
  width: number;
  initialX: number;
}

interface MatterBodyWithElement {
  [key: string]: any;
  element?: HTMLSpanElement;
}

export default function FallingText({
  text = '',
  highlightWords = [],
  highlightClass = 'highlighted',
  trigger = 'hover',
  effectStarted = false,
  gravity = 1,
  fontSize = 'clamp(2.5rem, 6vw, 5rem)',
  backgroundColor = 'transparent',
  mouseConstraintStiffness = 0.2,
  onReset = null
}: FallingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<WordSpan[]>([]);
  const [physicsActive, setPhysicsActive] = useState(false);

  // Sync physics status with effectStarted
  useEffect(() => {
    if (effectStarted) {
      setPhysicsActive(true);
    } else {
      setPhysicsActive(false);
    }
  }, [effectStarted]);

  // Initial horizontal neat layout when physics is not active
  useEffect(() => {
    const container = containerRef.current;
    if (!container || physicsActive) return;

    // Clear any existing children first
    container.innerHTML = '';

    const words = text.split(/\s+/);
    const wordSpans: WordSpan[] = [];

    // Create temp div to measure sizes
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.fontSize = fontSize;
    measureDiv.style.fontFamily = 'Bricolage Grotesque, sans-serif';
    measureDiv.style.fontWeight = 'bold';
    measureDiv.style.whiteSpace = 'nowrap';
    document.body.appendChild(measureDiv);

    // Measure each word and accumulate total width
    const wordWidths: number[] = [];
    let totalWordsWidth = 0;
    const gap = 15;

    words.forEach((word) => {
      measureDiv.textContent = word;
      const rect = measureDiv.getBoundingClientRect();
      const w = rect.width || (word.length * 30);
      wordWidths.push(w);
      totalWordsWidth += w;
    });
    totalWordsWidth += gap * (words.length - 1);

    document.body.removeChild(measureDiv);

    const width = container.clientWidth || window.innerWidth;
    const height = 250; // Fixed top portion height as requested!

    let startX = (width - totalWordsWidth) / 2;
    if (startX < 20) startX = 20;

    words.forEach((word, index) => {
      const cleanWord = word.replace(/[?,.:!]/g, '');
      const isHighlighted = highlightWords.includes(cleanWord);

      const span = document.createElement('span');
      span.textContent = word;
      span.className = `falling-word ${isHighlighted ? highlightClass : ''}`;
      span.style.fontSize = fontSize;
      span.style.position = 'absolute';
      span.style.userSelect = 'none';
      span.style.cursor = 'pointer';
      span.style.left = `${startX}px`;
      span.style.top = `${(height - 60) / 2}px`;
      span.style.transform = 'rotate(0deg)';
      
      container.appendChild(span);
      wordSpans.push({ element: span, width: wordWidths[index], initialX: startX });

      startX += wordWidths[index] + gap;
    });

    setElements(wordSpans);

    return () => {
      wordSpans.forEach(item => {
        if (container.contains(item.element)) {
          container.removeChild(item.element);
        }
      });
    };
  }, [text, physicsActive, fontSize, highlightWords, highlightClass]);

  // Matter.js Physics Effect
  useEffect(() => {
    if (!physicsActive || elements.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650; // Spans full section bounds

    const { Engine, World, Bodies, Mouse, MouseConstraint, Runner } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: gravity, scale: 0.001 } // Straight down gravity
    });
    const { world } = engine;

    const wordBodies: MatterBodyWithElement[] = [];

    // Create boundaries (walls + ground)
    const thickness = 100;
    const ground = Bodies.rectangle(width / 2, height + thickness / 2 - 10, width * 2, thickness, { isStatic: true });
    const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, { isStatic: true });
    World.add(world, [ground, leftWall, rightWall]);

    // Build physical bodies at their current horizontal layout position (top 250px vertical-aligned center)
    elements.forEach((item) => {
      const el = item.element;
      const wordWidth = item.width;
      const wordHeight = el.offsetHeight || 60;

      const currentX = item.initialX + wordWidth / 2;
      const currentY = (250 - wordHeight) / 2; // Placed at top 250px center

      const body: MatterBodyWithElement = Bodies.rectangle(currentX, currentY, wordWidth, wordHeight, {
        restitution: 0.5,
        friction: 0.1,
        frictionAir: 0.015,
        angle: (Math.random() - 0.5) * 0.1
      });

      body.element = el;
      el.style.cursor = 'grab';

      World.add(world, body);
      wordBodies.push(body);
    });

    // Add Mouse interaction
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false }
      }
    } as any);
    World.add(world, mouseConstraint);

    // Run Engine & Runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Update positions Loop
    let animationId: number;
    const update = () => {
      wordBodies.forEach(body => {
        if (body.element) {
          const { x, y } = body.position;
          const w = body.element.offsetWidth;
          const h = body.element.offsetHeight;
          body.element.style.left = `${x - w / 2}px`;
          body.element.style.top = `${y - h / 2}px`;
          body.element.style.transform = `rotate(${body.angle}rad)`;
        }
      });
      Engine.update(engine);
      animationId = requestAnimationFrame(update);
    };
    update();

    // Reset option: after 5 seconds of falling, reset back
    let resetTimeout: NodeJS.Timeout;
    if (onReset) {
      resetTimeout = setTimeout(() => {
        onReset();
      }, 5000);
    }

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + thickness / 2 - 10 });
      Matter.Body.setPosition(leftWall, { x: -thickness / 2, y: newHeight / 2 });
      Matter.Body.setPosition(rightWall, { x: newWidth + thickness / 2, y: newHeight / 2 });
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(resetTimeout);
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
    };
  }, [physicsActive, elements, gravity, mouseConstraintStiffness, onReset]);

  return (
    <div
      ref={containerRef}
      className="falling-text-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '650px',
        overflow: 'hidden',
        backgroundColor: backgroundColor
      }}
    />
  );
}
