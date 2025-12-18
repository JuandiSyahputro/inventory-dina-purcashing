"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CardCustom } from "../ui/card-custom";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "📦",
    title: "Real-Time Inventory Tracking",
    description: "Monitor stock levels across unlimited locations with instant updates, barcode scanning, and automated alerts for low inventory.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Demand Forecasting",
    description: "Machine learning algorithms predict demand patterns with 95% accuracy, reducing overstock by 35% and stockouts by 40%.",
  },
  {
    icon: "🔄",
    title: "Intelligent Reordering System",
    description: "Automated purchase order generation based on demand forecasts, supplier lead times, and optimal reorder points.",
  },
  {
    icon: "📱",
    title: "Mobile-First Platform",
    description: "Full-featured iOS and Android apps for warehouse staff, managers, and executives with offline capabilities.",
  },
  {
    icon: "🔗",
    title: "Seamless Integrations",
    description: "Connect with Shopify, WooCommerce, QuickBooks, NetSuite, SAP, and 500+ other business applications.",
  },
  {
    icon: "🔒",
    title: "Enterprise-Grade Security",
    description: "SOC 2 Type II certified, GDPR compliant, 256-bit encryption, and 99.99% uptime SLA guarantee.",
  },
];

export const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
      });
    }

    // Animate feature cards
    if (gridRef.current) {
      gsap.from(gridRef.current.querySelectorAll(".feature-card"), {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        duration: 0.6,
        opacity: 0,
        y: 40,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    }
  }, []);

  return (
    <section ref={containerRef} id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-light">
      <div className="max-w-7xl mx-auto">
        <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-900">
          Powerful Features
        </h2>
        <p className="text-center text-gray-600 text-lg mb-16">Everything you need to manage inventory effectively</p>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <CardCustom key={index} className="feature-card p-8">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </CardCustom>
          ))}
        </div>
      </div>
    </section>
  );
};
