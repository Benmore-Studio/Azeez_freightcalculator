"use client";

import { useId } from "react";

export default function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  icon = null,
  required = false,
  disabled = false,
  helperText = "",
  className = "",
  ...props
}) {
  const inputId = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-base
            border-2 rounded-md
            transition-colors duration-200
            ${icon ? "pl-12" : ""}
            ${error
              ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              : "border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            }
            ${disabled ? "bg-neutral-50 cursor-not-allowed opacity-60" : "bg-white"}
            focus:outline-none
            placeholder:text-neutral-400
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
