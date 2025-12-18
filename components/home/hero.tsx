"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ButtonCustom } from "../ui/button-custom";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // Animate title words
    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll(".hero-word");
      tl.from(
        words,
        {
          duration: 0.8,
          opacity: 0,
          y: 30,
          stagger: 0.1,
          ease: "power2.out",
        },
        0
      );
    }

    // Animate description
    if (descRef.current) {
      tl.from(
        descRef.current,
        {
          duration: 0.8,
          opacity: 0,
          y: 20,
          ease: "power2.out",
        },
        0.3
      );
    }

    // Animate buttons
    if (buttonsRef.current) {
      tl.from(
        buttonsRef.current.querySelectorAll(".child-button"),
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          // immediateRender: false,
          clearProps: "opacity,transform",
        },
        0.6
      );
    }
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-light via-white to-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 ref={titleRef} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="hero-word bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Intelligent</span>
          <span className="hero-word block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Inventory</span>
          <span className="hero-word block text-gray-900">Management Platform</span>
        </h1>

        <p ref={descRef} className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed">
          Reduce stockouts by 40%, cut carrying costs by 30%, and gain complete visibility into your inventory with AI-powered forecasting and real-time tracking across all locations.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonCustom variant="primary" size="lg" className="child-button">
            Start Free Trial
          </ButtonCustom>
          <ButtonCustom variant="secondary" size="lg" className="child-button">
            Watch Demo
          </ButtonCustom>
        </div>
      </div>
    </section>
  );
};
