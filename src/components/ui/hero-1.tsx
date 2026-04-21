"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function Hero({
  eyebrow = "Premium Automotive Management",
  title,
  subtitle,
  ctaLabel = "Get Started",
  ctaHref = "/auth/register",
  secondaryLabel,
  secondaryHref,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-40 px-6 text-center md:px-8
      min-h-[calc(100vh-40px)] overflow-hidden
      dark:bg-[linear-gradient(to_bottom,#080808,#080808_30%,#1a1a1a_78%,#080808_99%)]
      rounded-b-xl"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-30 h-[600px] w-full
        dark:bg-[linear-gradient(to_right,rgba(212,175,55,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.08)_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent — dark arc */}
      <div
        className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)]
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%]
        -translate-x-1/2 rounded-[100%]
        dark:bg-[radial-gradient(closest-side,#080808_82%,rgba(212,175,55,0.12))]
        animate-fade-up"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <div className="mb-8">
          <span
            className="text-sm text-gold-400/80 font-medium mx-auto px-5 py-2
            bg-gradient-to-tr from-gold-500/10 via-gold-400/5 to-transparent
            border border-gold-500/20
            rounded-3xl w-fit tracking-widest uppercase flex items-center justify-center gap-2 w-fit mx-auto"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            {eyebrow}
          </span>
        </div>
      )}

      {/* Title */}
      <h1
        className="animate-fade-in -translate-y-4 text-balance
        bg-gradient-to-br from-white from-30% to-white/40
        bg-clip-text py-6 text-5xl font-bold leading-none tracking-tight
        text-transparent opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in mb-12 -translate-y-4 text-balance
        text-lg tracking-tight text-white/50
        opacity-0 md:text-xl max-w-2xl mx-auto"
      >
        {subtitle}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-[-8px] z-20 relative">
        {ctaLabel && (
          <Button asChild size="lg" className="font-semibold tracking-tight text-base px-8">
            <Link href={ctaHref ?? "#"}>{ctaLabel}</Link>
          </Button>
        )}
        {secondaryLabel && (
          <Button asChild size="lg" variant="outline" className="font-semibold tracking-tight text-base px-8">
            <Link href={secondaryHref ?? "#"}>{secondaryLabel}</Link>
          </Button>
        )}
      </div>

      {/* Bottom Fade */}
      <div
        className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px]
        after:absolute after:inset-0 after:z-50
        after:[background:linear-gradient(to_top,#080808_10%,transparent)]"
      />
    </section>
  )
}
