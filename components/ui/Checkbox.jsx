"use client";

import { useId } from "react";

export default function Checkbox({
  label,
  checked,
  onChange,
  description = "",
  disabled = false,
  className = "",
  ...props
}) {
  const checkboxId = useId();

  return (
    <div className="flex items-start gap-3">
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          h-5 w-5 mt-0.5
          rounded border-2 border-neutral-300
          text-blue-600
          focus:ring-2 focus:ring-blue-200 focus:ring-offset-0
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          ${className}
        `}
        {...props}
      />

      {label && (
        <div className="flex-1">
          <label
            htmlFor={checkboxId}
            className={`text-sm font-medium text-neutral-700 cursor-pointer ${disabled ? 'opacity-50' : ''}`}
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
