import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#D97757] focus:ring-offset-2 focus:ring-offset-[#FFF9F5]",
  {
    variants: {
      variant: {
        default:
          "border-[#EFE3DB] bg-[#FFF9F5] text-[#81736C]",
        primary:
          "border-[#D97757]/30 bg-[#FCE8DD] text-[#D97757]",
        secondary:
          "border-[#EFE3DB] bg-white text-[#382A25]",
        destructive:
          "border-red-200 bg-red-50 text-[#B91C1C]",
        success:
          "border-emerald-200 bg-emerald-50 text-[#15803D]",
        warning:
          "border-amber-200 bg-amber-50 text-[#B45309]",
        outline: "border-[#EFE3DB] bg-transparent text-[#382A25]",
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
