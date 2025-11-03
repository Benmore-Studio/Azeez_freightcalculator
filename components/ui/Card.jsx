"use client";

export default function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}) {
  const variants = {
    default: "bg-white shadow-md",
    flat: "bg-white shadow-sm",
    elevated: "bg-white shadow-lg",
    outline: "bg-white border-2 border-neutral-200",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`rounded-lg ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
