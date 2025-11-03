"use client";
import ProgressBar from "./ProgressBar";
import Card from "./Card";

export default function ProgressHeader({
  title = "Let's get you set up",
  percentage = 0,
  className = "",
}) {
  return (
    <Card variant="flat" padding="md" className={className}>
      <ProgressBar
        value={percentage}
        max={100}
        showLabel
        label={title}
      />
    </Card>
  );
}
