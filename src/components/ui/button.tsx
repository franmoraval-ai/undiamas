import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-foreground px-5 text-background hover:bg-[#d9d6d0]",
        subtle: "border border-white/15 px-4 text-foreground hover:border-sand hover:text-sand",
        paper: "border border-ink/15 px-4 text-ink hover:border-ink/55",
        quiet: "text-muted hover:text-foreground",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}