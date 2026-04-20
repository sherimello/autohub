"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    quote: "AutoHub transformed how we manage our entire fleet. The precision and elegance are unmatched.",
    author: "James Harrington",
    role: "Fleet Director at Apex Motors",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format",
  },
  {
    id: 2,
    quote: "The client portal is extraordinary. My customers love the transparency and real-time updates.",
    author: "Marcus Chen",
    role: "Owner at Prestige Auto Works",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
  },
  {
    id: 3,
    quote: "Scheduling, invoicing, diagnostics — everything seamlessly integrated. Simply brilliant.",
    author: "Elena Vasquez",
    role: "Service Manager at LuxDrive Group",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format",
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote);
  const [displayedRole, setDisplayedRole] = useState(testimonials[0].role);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote);
      setDisplayedRole(testimonials[index].role);
      setActiveIndex(index);
      setTimeout(() => setIsAnimating(false), 400);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center gap-10 py-16">
      <div className="relative px-8">
        <span className="absolute -left-2 -top-6 text-7xl font-serif text-gold-500/10 select-none pointer-events-none">
          &ldquo;
        </span>
        <p
          className={cn(
            "text-2xl md:text-3xl font-light text-white/90 text-center max-w-2xl leading-relaxed transition-all duration-400 ease-out",
            isAnimating ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100"
          )}
        >
          {displayedQuote}
        </p>
        <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-gold-500/10 select-none pointer-events-none">
          &rdquo;
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 mt-2">
        <p
          className={cn(
            "text-xs text-gold-500/70 tracking-[0.3em] uppercase transition-all duration-500 ease-out",
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          {displayedRole}
        </p>

        <div className="flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index && !isActive;
            const showName = isActive || isHovered;

            return (
              <button
                key={testimonial.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex items-center gap-0 rounded-full cursor-pointer",
                  "transition-all duration-500 ease-apple-ease",
                  isActive ? "glass-gold shadow-lg" : "bg-transparent hover:glass",
                  showName ? "pr-4 pl-2 py-2" : "p-0.5"
                )}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={32}
                    height={32}
                    className={cn(
                      "w-8 h-8 rounded-full object-cover",
                      "transition-all duration-500 ease-apple-ease",
                      isActive ? "ring-2 ring-gold-500/50" : "ring-0",
                      !isActive && "hover:scale-105"
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "grid transition-all duration-500 ease-apple-ease",
                    showName ? "grid-cols-[1fr] opacity-100 ml-2" : "grid-cols-[0fr] opacity-0 ml-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-nowrap block transition-colors duration-300",
                        isActive ? "text-gold-400" : "text-white/80"
                      )}
                    >
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
