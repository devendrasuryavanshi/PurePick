import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ValidationMessage } from "../global/ValidationMessage";
import { FormInputProps } from "@/types/auth.types";

export const FormInputWithValidation = ({ id, name, type, placeholder, value, validation, onChange }: FormInputProps) => {

    return (
        <>
            <Input
                name={name}
                id={id}
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
                className={cn(
                    value && (
                        validation.isValid
                            ? "border-green-500 focus:border-green-500"
                            : "border-red-500 focus:border-red-500"
                    )
                )}
            />
            <ValidationMessage
                show={!validation.isValid}
                message={validation.message}
            />
        </>

    );
};
