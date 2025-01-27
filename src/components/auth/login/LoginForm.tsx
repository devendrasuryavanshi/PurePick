"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GoogleButton } from "@/components/global/GoogleButton";
import { signIn } from "next-auth/react";
import { redirectToPrevious } from "@/utils/redirect-previous";
import { Link } from "@nextui-org/react";
import { LoginBenefits } from "@/components/auth/login/LoginBenefits";
import { BottomGradientButton } from "@/components/global/BottomGradientButton";
import { LabelInputContainerProps } from "@/types/global.types";
import { FormInputWithValidation } from "../FormInputWithValidation";
import { PasswordInput } from "../PasswordInput";
import { isFormValid, validateField } from "@/utils/form-helpers";
import { loginSchema } from "@/schemas/auth.schema";
import { useAuthStore } from "@/zustand/useAuthStore";
import { toast } from "sonner";

export const LoginForm = () => {
    const { loginFormData, isSubmittingLogin, loginFormValidation } = useAuthStore();
    const { setLoginFormData, setLoginFormValidation, setIsSubmittingLogin } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        toast.loading("Logging in...");
        setIsSubmittingLogin(true);
        e.preventDefault();

        const { email, password, type } = loginFormData;
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            type
        });

        setIsSubmittingLogin(false);
        toast.dismiss();

        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success("Logged in successfully");
            redirectToPrevious();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLoginFormData({
            ...loginFormData,
            [id]: value
        });

        const validationResult = validateField(loginSchema.shape[id as keyof typeof loginSchema.shape], value);
        setLoginFormValidation({
            ...loginFormValidation,
            [id]: validationResult
        });
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full gap-32 p-4">
            <LoginBenefits />

            <div className="w-[90vw] max-w-lg lg:w-1/2 mx-auto rounded-2xl p-4 md:p-8">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-10 lg:hidden">
                    Login to PurePick
                </h2>

                <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 mb-4">
                        <LabelInputContainer>
                            <Label className="pl-1 pb-1" htmlFor="email">Email Address</Label>
                            <FormInputWithValidation
                                id="email"
                                name="email"
                                type="email"
                                placeholder="doraemon@gmail.com"
                                value={loginFormData.email}
                                onChange={handleInputChange}
                                validation={loginFormValidation.email}
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label className="pl-1 pb-1" htmlFor="password">Password</Label>
                            <PasswordInput
                                value={loginFormData.password}
                                validation={loginFormValidation.password}
                                onChange={handleInputChange}
                            />
                        </LabelInputContainer>
                    </div>

                    <BottomGradientButton text="Login →" type="submit" disabled={!isFormValid(loginSchema, loginFormData) || isSubmittingLogin} />
                    <p className="pl-2 text-sm mt-4 text-default-foreground">
                        Don&apos;t have an account? 
                        <Link className="text-sm pl-0.5" underline="hover" href="/signup">Signup</Link></p>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                    <div className="flex flex-col space-y-4">
                        <GoogleButton />
                    </div>
                </form>
            </div>
        </div>
    );
}

const LabelInputContainer = ({ children, className }: LabelInputContainerProps) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
    </div>
);