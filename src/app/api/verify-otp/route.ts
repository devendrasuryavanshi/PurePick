import { NextRequest, NextResponse } from 'next/server';
import { OtpType } from '@/types/otp.types';
import { canAttempt, formatWaitTime, verifyOtp } from '../helpers/otp-helpers';

export async function POST(req: NextRequest) {
    try {
        const { email, otp, type }: { email: string; otp: string; type: OtpType } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const attemptResponse = await canAttempt({ email, type });

        if (!attemptResponse.allowed) {
            return NextResponse.json({
                error: `Too many requests. Please try again in ${formatWaitTime(attemptResponse.waitTime || 0)}`
            }, { status: 429 });
        }

        const verificationRes = await verifyOtp(email, otp, type);

        if (!verificationRes.isVerified) {
            return NextResponse.json({ error: verificationRes.reason }, { status: 400 });
        }

        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}