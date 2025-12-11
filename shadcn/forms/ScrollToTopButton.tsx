"use client";
import React, { useState, useEffect } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ChevronUpIcon } from "lucide-react";

export default function ScrollToTopButton() {
  const scrollToTop = useScrollToTop();
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-5 right-5
        fill-white drop-shadow-xl/25
        bg-white h-12 w-12
        rounded-full items-center justify-center flex
        cursor-pointer
        transition-opacity duration-300 ease-in-out
        ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      <ChevronUpIcon className="size-6 text-primary" />
    </button>
  );
}
