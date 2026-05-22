"use client";

import React, { useEffect, useState } from 'react';

interface TextTypeProps {
  text: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

export default function TextType({
  text = [],
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 2000,
  loop = true
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentFullText = text[currentTextIndex];

    if (!currentFullText) return;

    if (isDeleting) {
      if (displayedText === '') {
        setIsDeleting(false);
        if (currentTextIndex === text.length - 1 && !loop) {
          return;
        }
        setCurrentTextIndex((prev) => (prev + 1) % text.length);
        timeout = setTimeout(() => {}, pauseDuration);
      } else {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (displayedText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => currentFullText.slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        if (!loop && currentTextIndex === text.length - 1) return;
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentTextIndex, text, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className="text-type">
      <span className="text-type__content">{displayedText}</span>
      <span className="text-type__cursor">|</span>
      <style jsx global>{`
        .text-type__cursor {
          animation: blink 1s infinite alternate;
          color: #C9A227;
          margin-left: 2px;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
