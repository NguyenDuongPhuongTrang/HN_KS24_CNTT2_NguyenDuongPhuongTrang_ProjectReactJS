import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
  onClick?: () => void; 
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg ${className}`}
      onClick={onClick} 
    >
      {text}
    </button>
  );
};

export default Button;