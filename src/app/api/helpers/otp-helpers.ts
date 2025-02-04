import { authenticator } from "otplib";
import { AttemptResponse, canAttemptProps, OtpType, saveOrUpdateOtpProps, saveOrUpdateOtpResponse } from "@/types/otp.types";


// OTP Generation
export const generateOTP = (): string => {
    const secret = authenticator.generateSecret();
    authenticator.options = { digits: 6 };
    return authenticator.generate(secret);
};

// Rate Limiting and Attempt Management
export const canAttempt = async ({ email, type }: canAttemptProps): Promise<AttemptResponse> => {
    const result = await fetch('https://purepick-backend.onrender.com/api/can-attempt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, type })
    });

    if(!result.ok) {
        return { allowed: false, waitTime: 0 };
    }

    const data = await result.json();
    return { allowed: data.allowed, waitTime: data?.waitTime };
};

// OTP Storage and Update
export const saveOrUpdateOtp = async ({ email, hashedOTP, type }: saveOrUpdateOtpProps): Promise<saveOrUpdateOtpResponse> => {
    const result = await fetch('https://purepick-backend.onrender.com/api/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, hashedOTP, type })
    });

    if(!result.ok) {
        return { isSaved: false };
    }

    const data = await result.json();

    return  { isSaved: data.isSent || false };
};

export const verifyOtp = async (email: string, providedOtp: string, type: OtpType): Promise<{ reason: string; isVerified: boolean }> => {
    const result = await fetch('https://purepick-backend.onrender.com/api/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp: providedOtp, type })
    });

    const data = await result.json();

    if (data.error) {
        return { reason: data.error, isVerified: false };
    }

    return { reason: '', isVerified: true };

};

export const formatWaitTime = (seconds: number): string => {
    if (seconds < 60) {
        return `${seconds} seconds`;
    }

    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return remainingSeconds > 0
            ? `${minutes} minutes and ${remainingSeconds} seconds`
            : `${minutes} minutes`;
    }

    if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return minutes > 0
            ? `${hours} hours and ${minutes} minutes`
            : `${hours} hours`;
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return hours > 0
        ? `${days} days and ${hours} hours`
        : `${days} days`;
}