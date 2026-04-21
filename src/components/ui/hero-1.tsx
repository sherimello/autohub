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
      bg-[linear-gradient(to_bottom,#080808,#080808_30%,#3a3a3a_78%,#080808_99%)]
      rounded-b-xl"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-80 h-[600px] w-full
        bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial planet arc — the signature element */}
      <div
        className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)]
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%]
        -translate-x-1/2 rounded-[100%]
        bg-[radial-gradient(closest-side,#080808_82%,#D4AF37)]
        animate-fade-up"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href="#" className="group inline-block mb-8">
          <span
            className="text-sm text-gray-400 mx-auto px-5 py-2
            bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent
            border border-white/10
            rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center gap-2"
          >
            {eyebrow}
            <ChevronRight className="inline w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </a>
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
        text-lg tracking-tight text-gray-400
        opacity-0 md:text-xl max-w-2xl mx-auto"
      >
        {subtitle}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 z-20 relative">
        {ctaLabel && (
          <Button
            asChild
            className="w-fit md:w-52 font-semibold tracking-tight text-base"
          >
            <Link href={ctaHref ?? "#"}>{ctaLabel}</Link>
          </Button>
        )}
        {secondaryLabel && (
          <Button
            asChild
            variant="outline"
            className="w-fit md:w-52 font-semibold tracking-tight text-base"
          >
            <Link href={secondaryHref ?? "#"}>{secondaryLabel}</Link>
          </Button>
        )}
      </div>

      {/* Bottom spacer so arc is visible */}
      <div className="relative mt-32" />
    </section>
  )
}
