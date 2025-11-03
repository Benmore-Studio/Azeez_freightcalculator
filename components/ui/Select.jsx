"use client";

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error = "",
  required = false,
  disabled = false,
  helperText = "",
  className = "",
  ...props
}) {
  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-base
          border-2 rounded-md
          transition-colors duration-200
          ${error
            ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
            : "border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          }
          ${disabled ? "bg-neutral-50 cursor-not-allowed opacity-60" : "bg-white"}
          focus:outline-none
          ${className}
        `}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
