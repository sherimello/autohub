import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gold-gradient text-black shadow-lg shadow-gold-700/20 hover:shadow-gold-600/40 hover:scale-[1.02] active:scale-[0.98] font-semibold",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white",
        outline:
          "glass border-white/10 hover:border-gold-500/40 hover:bg-gold-500/5 text-white/90 hover:text-white",
        secondary:
          "glass text-white/80 hover:text-white hover:border-white/20",
        ghost:
          "text-white/70 hover:text-white hover:bg-white/5 rounded-xl",
        link:
          "text-gold-400 underline-offset-4 hover:underline hover:text-gold-300",
        gold:
          "glass-gold text-gold-300 hover:text-gold-200 hover:border-gold-400/40 font-medium",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-2xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
