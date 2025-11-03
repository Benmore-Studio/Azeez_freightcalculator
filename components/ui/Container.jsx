"use client";

export default function Container({
  children,
  size = "default",
  className = "",
  ...props
}) {
  const sizes = {
    sm: "max-w-2xl",      // ~672px
    default: "max-w-4xl",  // ~896px (replaces 50%)
    lg: "max-w-6xl",      // ~1152px
    xl: "max-w-7xl",      // ~1280px
    full: "max-w-full",
  };

  return (
    <div
      className={`
        w-full
        ${sizes[size]}
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
