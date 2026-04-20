"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "@/components/ui/sparkles";

const perks = [
  "Full vehicle history tracking",
  "Real-time service updates",
  "Digital invoicing & receipts",
  "24/7 appointment booking",
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      await signIn("credentials", { email, password, redirect: false });
      router.push("/client/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="absolute inset-0 opacity-20">
          <Sparkles density={400} color="#D4AF37" size={1} speed={0.4} />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-lg shadow-gold-700/30">
            <Zap className="w-5 h-5 text-black" fill="black" />
          </div>
          <span className="text-2xl font-bold text-white">Auto<span className="text-gold">Hub</span></span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">
            The Platform Built for{" "}
            <span className="text-gold">Excellence</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">
            Join automotive professionals worldwide who trust AutoHub to manage their most valuable assets.
          </p>
          <div className="space-y-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full glass-gold flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                </div>
                <span className="text-white/70 text-sm">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/20 text-sm">© 2024 AutoHub. Engineered for excellence.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 glass-dark" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" fill="black" />
            </div>
            <span className="text-xl font-bold text-white">Auto<span className="text-gold">Hub</span></span>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
              <p className="text-white/40 text-sm">Start managing your vehicles today</p>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Mitchell"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
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
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
