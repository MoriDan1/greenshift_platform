import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-[#1A4D2E] ${className}`}
      {...props}
    />
  );
});