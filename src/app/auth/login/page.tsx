"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "@/components/ui/sparkles";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Fetch session to determine role
    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (session?.user?.role === "ADMIN" || session?.user?.role === "STAFF") {
      router.push("/admin/dashboard");
    } else {
      router.push("/client/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_70%)]" />

      {/* Sparkles */}
      <div className="absolute inset-0 opacity-40">
        <Sparkles density={300} color="#D4AF37" size={0.8} speed={0.5} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Card */}
        <div className="glass-dark rounded-3xl p-8 border border-white/8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-lg shadow-gold-700/30">
                <Zap className="w-5 h-5 text-black" fill="black" />
              </div>
              <span className="text-2xl font-bold text-white">
                Auto<span className="text-gold">Hub</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/40 text-sm">Sign in to access your portal</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-gold-400/70 hover:text-gold-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 glass rounded-xl p-4 border border-white/5">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-2 font-medium">Demo Credentials</p>
            <div className="space-y-1 text-xs text-white/50">
              <p><span className="text-gold-400/70">Admin:</span> admin@autohub.com / admin123</p>
              <p><span className="text-gold-400/70">Client:</span> john@example.com / client123</p>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-white/40 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
