// signup

import { ValidationState } from "./global.types";

export interface SignupForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: string;
    gender: string;
    age: string;
    type: 'signup';
}

export interface SignupFormValidation {
    firstName: ValidationState;
    lastName: ValidationState;
    age: ValidationState;
    gender: ValidationState;
    email: ValidationState;
    password: ValidationState;
    otp: ValidationState;
}

export interface FormInputProps {
    id: string;
    name: string;
    type: string;
    placeholder: string;
    value: string;
    validation: ValidationState;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface LoginFormData {
    email: string;
    password: string;
    type: 'login';
}

export interface LoginFormValidation {
    email: ValidationState;
    password: ValidationState;
}

export interface BottomGradientButtonProps {
    isSendingOtp?: boolean;
    text: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export interface PasswordInputProps {
    value: string;
    validation: ValidationState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}