import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  id?: string;
  dataActive?: boolean;
}

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  id,
  dataActive = false,
}: ButtonProps) => {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-active={dataActive}
      className={`btn ${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;