export interface OtpData {
    attempts: number;
    otp: string;
    lastAttemptTime: number;
}

export interface IpData {
    requests: number;
}

export type OtpType = 'Verification' | 'Reset' | 'Signup' | 'Login';

export interface canAttemptProps {
    email: string;
    type: OtpType;
}

export interface AttemptResponse {
    allowed: boolean;
    waitTime?: number;
}

export interface saveOrUpdateOtpProps {
    email: string;
    hashedOTP: string;
    type: OtpType;
}

export interface saveOrUpdateOtpResponse {
    isSaved: boolean;
}

export interface sendOtpProps {
    email: string;
    type: OtpType;
}

export interface sendOtpResponse {
    error?: string;
    isSent: boolean;
}

export interface verifyOtpProps {
    email: string;
    otp: string;
    type: OtpType;
}

export interface verifyOtpResponse {
    error?: string;
    isVerified: boolean;
}