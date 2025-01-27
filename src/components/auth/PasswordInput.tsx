import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FormInputWithValidation } from "./FormInputWithValidation";
import { PasswordInputProps } from "@/types/auth.types";

export const PasswordInput = ({ value, validation, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleEyeClick = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="relative w-full">
      <FormInputWithValidation
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        validation={validation}
        onChange={onChange}
      />
      <div
        className={`absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:dark:text-gray-200 hover:text-gray-800 cursor-pointer ${!validation.isValid && 'bottom-6'}`}
        onClick={handleEyeClick}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>
  );
};
