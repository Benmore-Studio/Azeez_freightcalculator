"use client";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function BackButton({
  onClick,
  label = "Back to previous step",
  className = "",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2
        text-blue-800 font-medium text-sm
        hover:text-blue-900
        transition-colors
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      <FaArrowLeftLong className="text-sm" />
      <span>{label}</span>
    </button>
  );
}
