import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "priority" | "category" | "tag";
}

const Badge = ({
  children,
  variant = "tag",
}: BadgeProps) => {
  return (
    <span className={`badge ${variant}`}>
      {children}
    </span>
  );
};

export default Badge;
