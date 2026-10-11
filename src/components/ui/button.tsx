import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97757] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F5] disabled:pointer-events-none disabled:opacity-50 rounded-xl",
  {
    variants: {
      variant: {
        default:
          "bg-[#D97757] text-white border border-[#D97757] hover:bg-[#B95F42] hover:border-[#B95F42] shadow-sm font-semibold",
        destructive:
          "bg-[#B91C1C] text-white border border-[#B91C1C] hover:bg-[#991B1B]",
        outline:
          "bg-white text-[#D97757] border border-[#EFE3DB] hover:bg-[#FCE8DD]/40 hover:border-[#D97757] shadow-sm",
        secondary:
          "bg-[#FCE8DD] text-[#382A25] border border-[#EFE3DB] hover:bg-[#FCE8DD]/80",
        ghost:
          "bg-transparent text-[#81736C] border border-transparent hover:bg-[#FCE8DD]/30 hover:text-[#382A25]",
        link: "text-[#D97757] underline-offset-4 hover:underline font-semibold",
        gold:
          "bg-[#B45309] text-white border border-[#B45309] hover:bg-[#92400E] shadow-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
