import { initialLoginFormData, initialLoginFormValidation, initialSignupFormData, initialSignupFormValidation } from '@/data/constants';
import { LoginFormData, LoginFormValidation, SignupForm, SignupFormValidation } from '@/types/auth.types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
    formData: SignupForm;
    step: number;
    isSendingOtp: boolean;
    signupFormValidation: SignupFormValidation;
    isSubmitting: boolean;

    setFormData: (formData: SignupForm) => void;
    setStep: (step: number) => void;
    setIsSendingOtp: (isSendingOtp: boolean) => void;
    setSignupFormValidation: (signupFormValidation: SignupFormValidation) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
    
    // login
    loginFormData: LoginFormData;
    isSubmittingLogin: boolean;
    loginFormValidation: LoginFormValidation;

    setLoginFormData: (loginFormData: LoginFormData) => void;
    setIsSubmittingLogin: (isSubmittingLogin: boolean) => void;
    setLoginFormValidation: (loginFormValidation: LoginFormValidation) => void;
}

export const useAuthStore = create<AuthState>()(
    devtools((set) => ({
        formData: initialSignupFormData,
        step: 1,
        isSendingOtp: false,
        isSubmitting: false,
        signupFormValidation: initialSignupFormValidation,

        setFormData: (formData) => set({ formData }),
        setStep: (step) => set({ step }),
        setIsSendingOtp: (isSendingOtp) => set({ isSendingOtp }),
        setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
        setSignupFormValidation: (signupFormValidation) => set({ signupFormValidation }),
        resetForm: () => set({ 
            formData: initialSignupFormData,
            step: 1,
            isSendingOtp: false,
            isSubmitting: false,
            signupFormValidation: initialSignupFormValidation
        }),

        // login
        loginFormData: initialLoginFormData,
        isSubmittingLogin: false,
        loginFormValidation: initialLoginFormValidation,

        setLoginFormData: (loginFormData) => set({ loginFormData }),
        setIsSubmittingLogin: (isSubmittingLogin) => set({ isSubmittingLogin }),
        setLoginFormValidation: (loginFormValidation) => set({ loginFormValidation }),
        resetLoginForm: () => set({
            loginFormData: initialLoginFormData,
            isSubmittingLogin: false,
            loginFormValidation: initialLoginFormValidation
        })
    }))
);
