import { sendOtpProps, sendOtpResponse, verifyOtpProps, verifyOtpResponse } from "@/types/otp.types";

export const verifyOpt = async ({ email, otp, type} : verifyOtpProps): Promise<verifyOtpResponse> => {
    try {
        const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, otp: otp, type: type }),
        });

        const resData = await response.json();
        if (resData.error) {
            return { error: resData.error, isVerified: false };
        }

        return { isVerified: true };
    } catch (error) {
        return { error: 'Verification Failed', isVerified: false };
    }
}