import { useAuthStore } from '@/zustand/useAuthStore';
import { signupSchema } from '@/schemas/auth.schema';
import { validateField, isFormValid } from '@/utils/form-helpers';
import { toast } from 'sonner';
import { sendOpt } from '@/lib/send-otp';
import { signIn } from 'next-auth/react';

export const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
    const { formData, setFormData, signupFormValidation, setSignupFormValidation } = useAuthStore.getState();
    const { id, value } = e.target;
    const parsedValue = id === 'age' ? Number(value) : value;

    setFormData({ ...formData, [id]: parsedValue });

    const validationResult = validateField(signupSchema.shape[id as keyof typeof signupSchema.shape], parsedValue);
    setSignupFormValidation({
        ...signupFormValidation,
        [id]: validationResult
    });
};

export const handleGetOtp = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) => {
    event.preventDefault();
    const { formData, setStep, setIsSendingOtp } = useAuthStore.getState();

    if (!isFormValid(signupSchema, formData)) return;

    toast.loading('Sending OTP...');
    setIsSendingOtp(true);
    const sendRes = await sendOpt({ email: formData.email, type: 'Verification' });
    toast.dismiss();

    if (sendRes.isSent) {
        setStep(2);
        toast.success('OTP sent successfully');
    } else {
        toast.error(sendRes.error);
    }

    setIsSendingOtp(false);
};

export const handleSubmit = async (router: any): Promise<void> => {
    const { formData } = useAuthStore.getState();

    if (!isFormValid(signupSchema, formData)) return;
    if (formData.otp.length < 6) {
        toast.error('OTP must be 6 digits');
        return;
    }

    const res = await signIn("credentials", {
        ...formData,
        redirect: false
    });

    if (res?.error) {
        toast.error(res.error);
        if (res.error === "User already exists. Please login.") {
            router.push("/login");
        }
    } else {
        toast.success("Signup successful!");
        router.push("/");
    }
};
