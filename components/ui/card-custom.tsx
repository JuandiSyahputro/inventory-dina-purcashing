"use client";

import React from "react";
import { useHoverAnimation } from "@/hooks/use-gsap-animation";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const CardCustom = React.forwardRef<HTMLDivElement, CardProps>(({ children, hover = true, className = "", ...props }, ref) => {
  const cardRef = useHoverAnimation({ y: -10, boxShadow: "0 20px 40px rgba(0, 102, 255, 0.1)" }, { y: 0, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)" });

  return (
    <div ref={hover ? cardRef : ref} className={`bg-linear-to-r from-primary to-secondary rounded-2xl border border-gray-200 transition-all duration-300 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardCustom.displayName = "CardCustom";
