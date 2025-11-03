"use client";

export default function ProgressBar({
  value = 0,
  max = 100,
  size = "md",
  showLabel = false,
  label = "",
  className = "",
  ...props
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">{label}</span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(percentage)}% Complete
          </span>
        </div>
      )}

      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className="bg-blue-800 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        />
      </div>
    </div>
  );
}
