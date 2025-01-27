"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Button, InputOtp } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LabelInputContainerProps } from "@/types/global.types";
import { verifyOpt } from "@/lib/verify-otp";
import { useAuthStore } from "@/zustand/useAuthStore";
import { handleGetOtp, handleSubmit } from "@/utils/signup-helpers";
import { useRouter } from "next/navigation";
import { validateField } from "@/utils/form-helpers";
import { signupSchema } from "@/schemas/auth.schema";

export const OtpVerification = () => {
    const router = useRouter();
    const { formData, isSendingOtp, signupFormValidation, isSubmitting } = useAuthStore();
    const { setFormData, setStep, setSignupFormValidation, setIsSubmitting } = useAuthStore();

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData({ ...formData, otp: value });

        const validationResult = validateField(signupSchema.shape['otp' as keyof typeof signupSchema.shape], value);
        setSignupFormValidation({
            ...signupFormValidation,
            otp: validationResult
        });
    };

    const handleVerifyOtp = async (): Promise<void> => {
        toast.loading('Verifing OTP...');
        setIsSubmitting(true);

        const verifyRes = await verifyOpt({ email: formData.email, otp: formData.otp, type: 'Verification' });
        toast.dismiss();

        if (verifyRes.isVerified) {
            toast.success('OTP verified successfully');

            await handleSubmit(router);
        } else {
            toast.error(verifyRes.error);
        }

        setIsSubmitting(false);
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <h3 className="text-xl font-semibold text-center">Verify Your Email</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 pb-20">
                We&apos;ve sent a verification code to {formData.email}
            </p>

            <div className="grid grid-cols-[2fr,1fr] gap-3">
                <LabelInputContainer>
                    <Label className="pl-1" htmlFor="otp">Enter OTP</Label>
                    <InputOtp
                        id="otp"
                        name="otp"
                        value={formData.otp}
                        onChange={handleOtpChange}
                        length={6}
                        variant="underlined"
                    />
                </LabelInputContainer>
                <LabelInputContainer>
                    <Label> </Label>
                    <Button
                        isLoading={isSendingOtp}
                        onClick={handleGetOtp}
                        color={"default"}
                        variant="flat"
                    >
                        {isSendingOtp ? '' : 'Resend'}
                    </Button>
                </LabelInputContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-10">
                <Button variant="solid" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={formData.otp.length != 6} isLoading={isSubmitting} variant="solid" color="primary" onClick={handleVerifyOtp}>{isSubmitting ? '' : 'Verify'}</Button>
            </div>
        </div>
    );
}

const LabelInputContainer = ({ children, className }: LabelInputContainerProps) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
    </div>
);
