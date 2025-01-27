"use client";

import React from "react";
import GenderInput from "@/components/global/Gender";
import { Link } from "@nextui-org/react";
import { signupSchema } from "@/schemas/auth.schema";
import { isFormValid } from "@/utils/form-helpers";
import { FormInputWithValidation } from "../FormInputWithValidation";
import { PasswordInput } from "../PasswordInput";
import { GoogleButton } from "@/components/global/GoogleButton";
import { BottomGradientButton } from "@/components/global/BottomGradientButton";
import { SignupBenefits } from "@/components/auth/signup/SignupBenefits";
import { OtpVerification } from "@/components/global/OtpVerification";
import { LabelInputContainer } from "../LabelInputContainer";
import { Label } from "../../ui/label";
import { useAuthStore } from "@/zustand/useAuthStore";
import { handleGetOtp, handleInputChange, handleSubmit } from "@/utils/signup-helpers";

export const SignupFormPage = () => {
    const { formData, step, isSendingOtp, signupFormValidation } = useAuthStore();

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full gap-8 p-4">
            <SignupBenefits />

            <div className="w-full max-w-md lg:w-1/2 mx-auto rounded-2xl p-4 md:p-8">
                <h2 className={`font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-10 lg:hidden ${step === 2 ? 'hidden' : ''}`}>
                    Sign up to PurePick
                </h2>

                {step === 1 && (
                    <>
                        <form className="my-4 grid gap-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-3">
                                <LabelInputContainer>
                                    <Label className="pl-1" htmlFor="firstName">First Name</Label>
                                    <FormInputWithValidation
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Doraemon"
                                        value={formData.firstName}
                                        validation={signupFormValidation.firstName}
                                        onChange={handleInputChange}
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label className="pl-1" htmlFor="lastName">Last Name</Label>
                                    <FormInputWithValidation
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Nobi"
                                        value={formData.lastName}
                                        validation={signupFormValidation.lastName}
                                        onChange={handleInputChange}
                                    />
                                </LabelInputContainer>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <LabelInputContainer>
                                    <Label className="pl-1" htmlFor="age">Age</Label>
                                    <FormInputWithValidation
                                        id="age"
                                        name="age"
                                        type="number"
                                        placeholder="21"
                                        value={formData.age}
                                        validation={signupFormValidation.age}
                                        onChange={handleInputChange}
                                    />
                                </LabelInputContainer>
                                <LabelInputContainer>
                                    <GenderInput handleInputChange={handleInputChange} />
                                </LabelInputContainer>
                            </div>

                            <LabelInputContainer>
                                <Label className="pl-1" htmlFor="email">Email Address</Label>
                                <FormInputWithValidation
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="doraemon@gmail.com"
                                    value={formData.email}
                                    validation={signupFormValidation.email}
                                    onChange={handleInputChange}
                                />
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label className="pl-1" htmlFor="password">Password</Label>
                                <PasswordInput
                                    value={formData.password}
                                    validation={signupFormValidation.password}
                                    onChange={handleInputChange}
                                />
                            </LabelInputContainer>

                            <BottomGradientButton
                                isSendingOtp={isSendingOtp}
                                text="Sign up →"
                                disabled={!isFormValid(signupSchema, formData) || isSendingOtp}
                                onClick={handleGetOtp}
                            />

                            <div className="space-y-4">
                                <p className="text-sm pl-1">
                                    Already have an account? <Link className="text-sm" underline="hover" href="/login">Log in</Link>
                                </p>
                                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px] w-full" />

                            </div>
                        </form>
                        <GoogleButton />
                    </>
                )}

                {step === 2 && (
                    <OtpVerification />
                )}
            </div>
        </div>
    );
}
