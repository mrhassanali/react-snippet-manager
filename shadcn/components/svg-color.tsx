// components/svg-color.tsx
import { cn } from "@/lib/utils"; // shadcn class merge utility
import React from "react";

export interface SvgColorProps extends React.HTMLAttributes<HTMLSpanElement> {
  src: string;
  style?: React.CSSProperties;
}

export function SvgColor({ src, className, style, ...props }: SvgColorProps) {
  return (
    <span
      className={cn("inline-flex w-6 h-6 shrink-0 bg-current", className)}
      style={{
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...style,
      }}
      {...props}
    />
  );
}