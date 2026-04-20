import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "glass-gold text-gold-400 border-gold-500/20",
        secondary: "glass text-white/60 border-white/10",
        destructive: "bg-red-500/10 text-red-400 border border-red-500/20",
        outline: "border border-white/15 text-white/70",
        gold: "bg-gold-gradient text-black font-semibold",
        silver: "bg-silver-gradient text-black font-semibold",
        success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
