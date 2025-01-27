import { ValidationMessageProps } from "@/types/global.types";

export const ValidationMessage = ({ show, message }: ValidationMessageProps) => (
    <span className="text-xs text-red-500">{show && message}</span>
);
