import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        {...props}
        className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
