"use client";

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  icon = null,
  iconPosition = "right",
  children,
  className = "",
  ...props
}) {
  const baseStyles = "font-semibold rounded-md transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-600",
    secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus:ring-neutral-400",
    outline: "border-2 border-blue-800 text-blue-800 hover:bg-blue-50 focus:ring-blue-600",
    ghost: "text-blue-800 hover:bg-blue-50 focus:ring-blue-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
