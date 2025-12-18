/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGsapAnimation = (animationFn: (element: HTMLElement) => void, dependencies: any[] = []) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      animationFn(elementRef.current);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [dependencies, animationFn]);

  return elementRef;
};

export const useScrollAnimation = (
  selector: string,
  animationConfig: {
    duration?: number;
    delay?: number;
    stagger?: number;
    ease?: string;
    from?: Record<string, any>;
    to?: Record<string, any>;
  } = {}
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { duration = 0.6, delay = 0, stagger = 0.1, ease = "power2.out", from = { opacity: 0, y: 40 }, to = { opacity: 1, y: 0 } } = animationConfig;

    gsap.from(elements, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      duration,
      delay,
      stagger,
      ease,
      ...from,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector, animationConfig]);

  return containerRef;
};

export const useHoverAnimation = (enterConfig: Record<string, any> = { scale: 1.05 }, leaveConfig: Record<string, any> = { scale: 1 }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        duration: 0.3,
        ease: "power2.out",
        ...enterConfig,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        duration: 0.3,
        ease: "power2.out",
        ...leaveConfig,
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enterConfig, leaveConfig]);

  return elementRef;
};

export const useClickAnimation = (clickConfig: Record<string, any> = { scale: 0.95 }, releaseConfig: Record<string, any> = { scale: 1 }) => {
  const elementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleClick = () => {
      gsap.to(element, {
        duration: 0.1,
        ease: "power2.out",
        ...clickConfig,
        onComplete: () => {
          gsap.to(element, {
            duration: 0.2,
            ease: "elastic.out(1, 0.5)",
            ...releaseConfig,
          });
        },
      });
    };

    element.addEventListener("click", handleClick);

    return () => {
      element.removeEventListener("click", handleClick);
    };
  }, [clickConfig, releaseConfig]);

  return elementRef;
};
