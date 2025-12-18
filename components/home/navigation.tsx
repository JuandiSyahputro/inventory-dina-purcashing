"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Button } from "../ui/button";

export const Navigation = () => {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.from(navRef.current, {
        duration: 0.6,
        opacity: 0,
        y: -20,
        ease: "power2.out",
      });
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav ref={navRef} className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IP</span>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">InventoryPro</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {["about", "features", "services", "pricing", "contact"].map((item) => (
              <Button key={item} onClick={() => scrollToSection(item)} className="text-gray-700 hover:text-primary font-medium transition-colors capitalize bg-transparent hover:bg-transparent cursor-pointer">
                {item}
              </Button>
            ))}
          </div>

          {/* CTA Button */}
          <ButtonCustom variant="primary" size="md">
            Get Started
          </ButtonCustom>
        </div>
      </div>
    </nav>
  );
};
