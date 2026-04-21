import Link from "next/link";
import { Sparkles } from "@/components/ui/sparkles";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { Testimonials } from "@/components/ui/unique-testimonial";
import { Marquee } from "@/components/ui/marquee";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import {
  Car, Wrench, FileText, Calendar, Shield, Gauge, ChevronRight,
  Zap, Star, Users, TrendingUp, Clock, Award, CheckCircle2,
} from "lucide-react";

// Brand logos (automotive industry relevant)
const BrandLogo = ({ name, abbr }: { name: string; abbr: string }) => (
  <div className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-300">
    <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-xs font-bold text-gold-400/60 border border-white/5">
      {abbr}
    </div>
    <span className="text-sm font-semibold tracking-wide uppercase">{name}</span>
  </div>
);

const brands = [
  { name: "Porsche Certified", abbr: "PC" },
  { name: "BMW Service", abbr: "BW" },
  { name: "Mercedes AMG", abbr: "MA" },
  { name: "Ferrari Works", abbr: "FW" },
  { name: "Lamborghini", abbr: "LB" },
  { name: "Aston Martin", abbr: "AM" },
  { name: "Bentley Motors", abbr: "BM" },
  { name: "Rolls-Royce", abbr: "RR" },
  { name: "McLaren Auto", abbr: "ML" },
  { name: "Bugatti Rimac", abbr: "BR" },
];

const features = [
  {
    icon: Car,
    title: "Vehicle Registry",
    description: "Comprehensive vehicle profiles with full service history, VIN tracking, and diagnostic records.",
    gradient: "from-gold-700/20 to-gold-500/5",
    iconColor: "text-gold-400",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "AI-powered appointment system with real-time availability, reminders, and technician assignment.",
    gradient: "from-blue-900/20 to-blue-800/5",
    iconColor: "text-blue-400",
  },
  {
    icon: FileText,
    title: "Digital Invoicing",
    description: "Automated invoicing with line-item breakdowns, tax calculation, and instant payment processing.",
    gradient: "from-silver-500/10 to-silver-400/5",
    iconColor: "text-silver-400",
  },
  {
    icon: Gauge,
    title: "Live Diagnostics",
    description: "Real-time vehicle health monitoring with OBD-II integration and predictive maintenance alerts.",
    gradient: "from-emerald-900/20 to-emerald-800/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Shield,
    title: "Service Warranties",
    description: "Track and manage service warranties, recall notices, and manufacturer guarantees in one place.",
    gradient: "from-purple-900/20 to-purple-800/5",
    iconColor: "text-purple-400",
  },
  {
    icon: Users,
    title: "Client Portal",
    description: "Dedicated customer dashboard for vehicle tracking, appointment booking, and invoice management.",
    gradient: "from-amber-900/20 to-amber-800/5",
    iconColor: "text-amber-400",
  },
];

const stats = [
  { value: "12,000+", label: "Vehicles Managed", icon: Car },
  { value: "98.7%", label: "Client Satisfaction", icon: Star },
  { value: "340+", label: "Service Centers", icon: Wrench },
  { value: "$2.4M", label: "Revenue Processed", icon: TrendingUp },
];

const services = [
  { name: "Oil & Fluid Service", time: "30 min", price: "From $49" },
  { name: "Brake System Service", time: "2 hrs", price: "From $199" },
  { name: "Engine Diagnostics", time: "1 hr", price: "From $89" },
  { name: "Tire Service & Rotation", time: "45 min", price: "From $29" },
  { name: "AC & Climate Service", time: "90 min", price: "From $149" },
  { name: "Full Detail & Ceramic", time: "4 hrs", price: "From $299" },
  { name: "Transmission Service", time: "3 hrs", price: "From $349" },
  { name: "Suspension & Alignment", time: "2 hrs", price: "From $129" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080808] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-2 mb-8 border border-gold-500/20">
            <Zap className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-semibold text-gold-300 tracking-widest uppercase">
              Premium Automotive Management
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[0.95]">
            <span className="block text-white">
              <BlurredStagger text="Engineer Your" className="text-white" />
            </span>
            <span className="block mt-2">
              <BlurredStagger text="Fleet's Future" className="shimmer-gold" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The most sophisticated automotive management platform. Built for precision workshops,
            premium dealerships, and discerning fleet owners who demand nothing but excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="xl" asChild>
              <Link href="/auth/register">
                Start Free Trial
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/auth/login">
                Access Portal
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 group hover:glass-gold transition-all duration-300">
                <stat.icon className="w-5 h-5 text-gold-500/60 mx-auto mb-2 group-hover:text-gold-400 transition-colors" />
                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sparkles Hero section */}
        <div className="relative w-full -mt-20">
          <div className="mx-auto mt-32 w-full max-w-3xl">
            {/* Trusted by */}
            <div className="text-center text-2xl md:text-3xl font-light px-6">
              <span className="text-white/40">Trusted by elite workshops.</span>
              <br />
              <span className="text-white/70">Used by industry leaders.</span>
            </div>

            <div className="mt-12 grid grid-cols-5 gap-6 px-8 text-white/30">
              {["Porsche\nCertified", "BMW\nGroup", "Mercedes\nAMG", "Ferrari\nSPA", "Bentley\nMotors"].map((name, i) => (
                <div key={i} className="text-center text-xs font-semibold uppercase tracking-wider whitespace-pre-line hover:text-white/60 transition-colors cursor-default">
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* Sparkle burst */}
          <div className="relative -mt-16 h-80 w-full overflow-hidden [mask-image:radial-gradient(circle_at_50%_50%,white,transparent)]">
            <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom,rgba(212,175,55,0.15),transparent_70%)]" />
            <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-gold-500/10 bg-[#080808]" />
            <Sparkles
              density={1000}
              className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
              color="#D4AF37"
              size={1.2}
            />
          </div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ── */}
      <section className="py-12 border-y border-white/5">
        <Marquee className="py-2" pauseOnHover gap="3rem" duration="30s">
          {brands.map((brand) => (
            <BrandLogo key={brand.name} {...brand} />
          ))}
        </Marquee>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-gold-400" />
            <span className="text-xs text-white/60 uppercase tracking-widest">Platform Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-5">
            Built for{" "}
            <span className="text-gold">Perfection</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Every feature engineered to the same standards as the vehicles you manage.
            Precision, reliability, and elegance in every interaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`relative glass rounded-2xl p-6 border border-white/6 hover:border-gold-500/20 transition-all duration-500 group overflow-hidden`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2.5">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>

                <div className="mt-5 flex items-center gap-1.5 text-xs text-gold-400/60 group-hover:text-gold-400 transition-colors">
                  <span>Explore feature</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-32 px-6 bg-gradient-to-b from-transparent via-gold-900/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <Wrench className="w-4 h-4 text-gold-400" />
              <span className="text-xs text-white/60 uppercase tracking-widest">Our Services</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-5">
              Every Service,{" "}
              <span className="text-gold">Mastered</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <div
                key={service.name}
                className="glass rounded-2xl p-5 border border-white/6 hover:border-gold-500/20 hover:glass-gold transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <CheckCircle2 className="w-5 h-5 text-gold-500/40 group-hover:text-gold-400 transition-colors" />
                  <span className="text-xs glass rounded-full px-2.5 py-1 text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.time}
                  </span>
                </div>
                <h3 className="font-semibold text-white/90 text-sm mb-2 group-hover:text-white transition-colors">{service.name}</h3>
                <p className="text-gold-400/70 text-xs font-medium">{service.price}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/register">
                Book a Service
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-gold-400" />
              <span className="text-xs text-white/60 uppercase tracking-widest">Client Stories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-5">
              Trusted by{" "}
              <span className="text-gold">Professionals</span>
            </h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-gold rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-gold-500/15">
            {/* Background sparkles */}
            <div className="absolute inset-0 opacity-30">
              <Sparkles density={200} color="#D4AF37" size={1.5} speed={0.5} />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-gold-500/20">
                <Zap className="w-8 h-8 text-gold-400" fill="rgba(212,175,55,0.2)" />
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-white mb-5">
                Ready to{" "}
                <span className="text-gold">Elevate</span>{" "}
                Your Workshop?
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of automotive professionals who trust AutoHub
                to manage their most valuable assets.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" asChild>
                  <Link href="/auth/register">
                    Start Free — No Card Required
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/auth/login">Sign In to Portal</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gold-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" fill="black" />
            </div>
            <span className="font-bold text-white">Auto<span className="text-gold">Hub</span></span>
          </div>
          <p className="text-white/30 text-sm">
            © 2024 AutoHub. Engineered for excellence.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/auth/login" className="hover:text-white/70 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
