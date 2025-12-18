"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate title
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    }

    // Animate content
    if (contentRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(
        contentRef.current.querySelector(".about-text"),
        {
          duration: 0.8,
          opacity: 0,
          x: -40,
          ease: "power2.out",
          clearProps: "opacity,transform",
        },
        0
      ).from(
        contentRef.current.querySelector(".about-image"),
        {
          duration: 0.8,
          opacity: 0,
          x: 40,
          ease: "power2.out",
          clearProps: "opacity,transform",
        },
        0
      );
    }
  }, []);

  return (
    <section ref={containerRef} id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-900">
          About InventoryPro
        </h2>
        <p className="text-center text-gray-600 text-lg mb-16">Revolutionizing inventory management since 2020</p>

        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="about-text">
            <h3 className="text-3xl font-bold text-primary mb-4">Why Choose InventoryPro?</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              InventoryPro is a comprehensive inventory management solution designed for businesses of all sizes. We combine powerful technology with intuitive design to help you manage your inventory efficiently.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">Our platform provides real-time visibility into your stock levels, automated reordering, and detailed analytics to help you make data-driven decisions.</p>
            <p className="text-gray-600 leading-relaxed">With over 5,000+ satisfied customers worldwide, we&apos;re trusted by leading retailers, manufacturers, and distributors to optimize their supply chain operations.</p>
          </div>
          <div className="about-image flex h-[400px] items-center justify-center rounded-[15px] text-white text-[1.2rem] font-semibold bg-linear-to-r from-primary to-secondary">📊 Dashboard Preview</div>
        </div>
      </div>
    </section>
  );
};
