import { ALLERGIES, MEDICAL_CONDITIONS } from "@/data/constants";
import { z } from "zod";

export const signupSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),
    age: z.number().min(1, "Must be at least 1 years old").max(120, "Must be under 100 years old"),
    email: z.string().email("Invalid email address")
        .max(100, "Email must be less than 100 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Must contain at least 1 number"),
    gender: z.enum(["male", "female", "other"]),
    otp: z.string(),

});

export type SignupFormData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    email: z.string().email("Invalid email address")
        .max(100, "Email must be less than 100 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Must contain at least 1 number"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),
    age: z.number().min(1, "Must be at least 1 years old").max(120, "Must be under 100 years old"),
    gender: z.enum(["male", "female", "other"]),
    allergies: z.array(z.enum([...ALLERGIES] as [string, ...string[]])).optional(),
    diseases: z.array(z.enum([...MEDICAL_CONDITIONS] as [string, ...string[]])).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
