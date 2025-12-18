"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Core Inventory Management",
    description: "Multi-location inventory tracking with real-time stock updates, barcode/RFID scanning, cycle counting, and automated stock adjustments. Manage unlimited SKUs with variants and serial number tracking.",
  },
  {
    title: "Demand Planning & Forecasting",
    description: "AI-powered demand forecasting using historical data, seasonality, and market trends. Reduce overstock by 35% and stockouts by 40% with intelligent predictions.",
  },
  {
    title: "Advanced Analytics & Reporting",
    description: "Custom dashboards, real-time KPIs, inventory turnover analysis, and predictive insights. Export reports in multiple formats with scheduled email delivery.",
  },
  {
    title: "Implementation & Migration",
    description: "Dedicated onboarding team handles data migration, system configuration, and staff training. Average implementation time: 2-4 weeks with zero downtime.",
  },
  {
    title: "Premium Support & Consulting",
    description: "Priority 24/7 support with dedicated account manager, quarterly business reviews, and strategic consulting to optimize your supply chain.",
  },
  {
    title: "Custom Integrations & APIs",
    description: "Build custom workflows with our REST APIs, webhooks, and Zapier integration. Our development team can create bespoke solutions for your unique needs.",
  },
];

export const Services = () => {
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

    // Animate service cards with stagger
    if (gridRef.current) {
      gsap.from(gridRef.current.querySelectorAll(".service-card"), {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        duration: 0.6,
        opacity: 0,
        x: (index) => (index % 2 === 0 ? -40 : 40),
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    }
  }, []);

  return (
    <section ref={containerRef} id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-900">
          Our Services
        </h2>
        <p className="text-center text-gray-600 text-lg mb-16">Comprehensive solutions tailored to your needs</p>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="service-card bg-linear-to-br from-light to-white p-8 rounded-2xl border-l-4 border-primary hover:border-secondary transition-all duration-300">
              <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
