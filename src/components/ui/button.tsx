import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "default", size = "default", type = "button", ...props },
  ref,
) {
  const variantClasses = {
    default: "bg-[#1A4D2E] text-white hover:bg-[#133922]",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    icon: "h-9 w-9 p-0",
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
});