import { sendOtpProps, sendOtpResponse } from "@/types/otp.types";

export const sendOpt = async ({ email, type} : sendOtpProps): Promise<sendOtpResponse> => {
    try {
        const response = await fetch('/api/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, type: type }),
        });

        const errorData = await response.json();
        if (errorData.error) {
            return { error: errorData.error, isSent: false };
        }

        return { isSent: true };
    } catch (error) {
        return { error: 'Failed to send OTP', isSent: false };
    }
}