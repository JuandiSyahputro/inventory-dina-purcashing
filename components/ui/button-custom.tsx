"use client";

import React from "react";
import { useClickAnimation } from "@/hooks/use-gsap-animation";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "primary", size = "md", className = "", ...props }) => {
  const buttonRef = useClickAnimation();

  const baseStyles = "font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg focus:ring-primary",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return <button ref={buttonRef} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
});

ButtonCustom.displayName = "ButtonCustom";
