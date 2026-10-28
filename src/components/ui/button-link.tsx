import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-lime-600 text-white shadow-sm hover:bg-lime-700",
  secondary: "border border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50",
  inverse: "bg-white text-lime-700 shadow-sm hover:bg-gray-100",
  "inverse-outline": "border border-white/30 text-white hover:bg-white/10",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function ButtonLink({ variant = "primary", size = "md", className = "", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={`group inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
