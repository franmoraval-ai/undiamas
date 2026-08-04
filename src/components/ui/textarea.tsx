import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-72 w-full resize-none bg-transparent text-lg leading-relaxed text-ink placeholder:text-ink/45 focus:outline-none sm:text-xl",
        className,
      )}
      {...props}
    />
  );
}