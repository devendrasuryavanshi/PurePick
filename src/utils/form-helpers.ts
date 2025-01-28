import { ValidationState } from "@/types/global.types";
import { z } from "zod";

export const validateField = (schema: z.ZodSchema, value: unknown): ValidationState => {
    try {
        schema.parse(value);
        return { isValid: true, message: '' };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { isValid: false, message: error.errors[0].message };
        }
        return { isValid: false, message: 'Invalid input' };
    }
};

export const isFormValid = (schema: z.ZodSchema, data: unknown): boolean => {
    try {
        schema.parse(data);
        return true;
    } catch (error) {
        return false;
    }
};
