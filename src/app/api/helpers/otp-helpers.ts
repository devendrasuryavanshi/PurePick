import { authenticator } from "otplib";
import NodeCache from "node-cache";
import { AttemptResponse, canAttemptProps, IpData, OtpData, OtpType, saveOrUpdateOtpProps, saveOrUpdateOtpResponse } from "@/types/otp.types";
import bcrypt from 'bcryptjs';

// Cache Configurations
const verificationCache = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: 10 }); // 24h
const resetCache = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: 10 }); // 24h

// Constants
const MAX_ATTEMPTS = 5;
const MAX_IP_REQUESTS = 10;
const BASE_BACKOFF = 2;
const EXPIRE_TIME = 5 * 60 * 1000;

// OTP Generation
export const generateOTP = (): string => {
    const secret = authenticator.generateSecret();
    authenticator.options = { digits: 6 };
    return authenticator.generate(secret);
};

// Cache Selection Helper
const getTargetCache = (type: OtpType): NodeCache => {
    return type === 'Verification' ? verificationCache : resetCache;
};

// Rate Limiting and Attempt Management
export const canAttempt = async ({ email, type }: canAttemptProps): Promise<AttemptResponse> => {

    const targetCache = getTargetCache(type);
    const data = targetCache.get<OtpData>(email);

    if (!data?.attempts || data.attempts < MAX_ATTEMPTS) {
        return { allowed: true };
    }

    const backoffTime = Math.pow(BASE_BACKOFF, data.attempts) * 1000;
    const waitTime = (data.lastAttemptTime + backoffTime - Date.now()) / 1000;

    return waitTime > 0
        ? { allowed: false, waitTime: Math.ceil(waitTime) }
        : { allowed: true };
};

// OTP Storage and Update
export const saveOrUpdateOtp = ({ email, hashedOTP, type }: saveOrUpdateOtpProps): saveOrUpdateOtpResponse => {
    try {
        const targetCache = getTargetCache(type);
        const currentData = targetCache.get<OtpData>(email);

        targetCache.set(email, {
            attempts: (currentData?.attempts || 0) + 1,
            otp: hashedOTP,
            lastAttemptTime: Date.now()
        });

        return { isSaved: true };
    } catch (error) {
        return { isSaved: false };
    }
};

export const verifyOtp = async (email: string, providedOtp: string, type: OtpType): Promise<{ reason: string; isVerified: boolean }> => {
    const targetCache = getTargetCache(type);
    const data = targetCache.get<OtpData>(email);

    if (!data) {
        return { reason: 'No OTP found', isVerified: false };
    }

    if (data.lastAttemptTime + EXPIRE_TIME < Date.now()) {
        return { reason: 'OTP expired', isVerified: false };
    }

    const isMatch = await bcrypt.compare(providedOtp, data.otp);

    if (isMatch) {
        return { reason: 'OTP verified successfully', isVerified: true };
    }

    return { reason: 'Invalid OTP', isVerified: false };
};


// Reset Attempts
export const resetAttempts = (email: string, type: OtpType): void => {
    const targetCache = getTargetCache(type);
    const data = targetCache.get<OtpData>(email);
    if (data?.otp) {
        targetCache.set(email, {
            ...data,
            attempts: 0,
            lastAttemptTime: Date.now()
        });
    }
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