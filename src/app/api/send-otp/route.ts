import bcrypt from 'bcryptjs';
import { z } from "zod";
import * as emailValidator from "email-validator";
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { OtpType } from '@/types/otp.types';
import dns from 'dns';
import { promisify } from 'util';
import { canAttempt, formatWaitTime, generateOTP, saveOrUpdateOtp } from '../helpers/otp-helpers';

const resolveMx = promisify(dns.resolveMx);

const emailSchema = z.string().email();

const isEmailValid = async(email: string): Promise<{ valid: boolean; reason?: string }> => {
    try {
        emailSchema.parse(email);
    } catch {
        return { valid: false, reason: "Invalid email format" };
    }

    if (!emailValidator.validate(email)) {
        return { valid: false, reason: "Invalid email structure" };
    }

    const domain = email.split('@')[1];
    try {
        const mxRecords = await resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
            return { valid: false, reason: "Invalid email domain" };
        }
    } catch {
        return { valid: false, reason: "Domain does not exist" };
    }

    return { valid: true };
}

export async function POST(req: NextRequest) { // send otp
    const { email, type }: { email: string; type: OtpType } = await req.json();

    const emailValidation = await isEmailValid(email);
    if (!emailValidation.valid) {
        return NextResponse.json({
            error: emailValidation.reason
        }, { status: 400 });
    }

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const attemptResponse = await canAttempt({ email, type });

    if (!attemptResponse.allowed) {
        return NextResponse.json({
            error: `Too many requests. Please try again in ${formatWaitTime(attemptResponse.waitTime || 0)}`
        }, { status: 429 });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        const otp = generateOTP();

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Your PurePick Verification Code',
            html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto; 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                            color: #1a1a1a;
                        }
                        .header { 
                            background: linear-gradient(135deg, #7928CA, #FF0080);
                            padding: 40px 32px;
                            border-radius: 20px 20px 0 0;
                            color: white;
                            text-align: center;
                        }
                        .logo {
                            margin-bottom: 20px;
                        }
                        img {
                            border-radius: 50%;
                        }
                        .content {
                            background: #ffffff;
                            padding: 40px 32px;
                            border-radius: 0 0 20px 20px;
                            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
                            text-align: center;
                        }
                        .otp-container {
                            margin: 32px 0;
                            padding: 24px;
                            background: linear-gradient(to right, rgba(121,40,202,0.1), rgba(255,0,128,0.1));
                            border-radius: 16px;
                            border: 1px dashed #7928CA;
                        }
                        .otp-code {
                            font-size: 36px;
                            letter-spacing: 12px;
                            font-weight: 700;
                            color: #7928CA;
                            margin: 0;
                            font-family: monospace;
                        }
                        .timer {
                            display: inline-block;
                            padding: 8px 16px;
                            background: #f8f9fa;
                            border-radius: 20px;
                            font-size: 14px;
                            color: #FF0080;
                            margin: 16px 0;
                        }
                        .divider {
                            height: 1px;
                            background: linear-gradient(to right, #7928CA, #FF0080);
                            margin: 24px 0;
                            opacity: 0.2;
                        }
                        .security-tips {
                            background: #f8f9fa;
                            padding: 20px;
                            border-radius: 12px;
                            margin-top: 24px;
                            text-align: left;
                        }
                        .tip {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            margin: 8px 0;
                            font-size: 14px;
                            color: #666;
                        }
                        .footer {
                            margin-top: 32px;
                            font-size: 14px;
                            color: #666;
                        }
                        .social-links {
                            margin-top: 20px;
                        }
                        .social-links a {
                            color: #7928CA;
                            text-decoration: none;
                            margin: 0 8px;
                        }
                    </style>
                </head>
                <body style="background-color: #f5f5f5; padding: 20px; margin: 0;">
                    <div class="container">
                        <div class="header">
                            <div class="logo">
                                <img src="https://drive.google.com/thumbnail?id=10bNWz4ttMoiOl6tw7NC58rFnQ7t8MmKI&sz=s4000" alt="PurePick" width="120" />
                            </div>
                            <h1 style="margin: 0; font-size: 28px;">Verify Your Identity</h1>
                            <p style="margin: 10px 0 0; opacity: 0.9;">Complete your ${type} process</p>
                        </div>
                        <div class="content">
                            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0;">Enter this verification code</h2>
                            <div class="otp-container">
                                <div class="otp-code">${otp}</div>
                            </div>
                            <div class="timer">⏰ Expires in 5 minutes</div>
                            
                            <div class="divider"></div>
                            
                            <div class="security-tips">
                                <h3 style="color: #7928CA; margin: 0 0 12px;">Security Tips</h3>
                                <div class="tip">🔒 Never share this code with anyone</div>
                                <div class="tip">⚡ Code is valid for one-time use only</div>
                                <div class="tip">🕒 Enter the code within 5 minutes</div>
                            </div>
                            
                            <div class="footer">
                                <p>If you didn't request this code, please ignore this email or contact support.</p>
                                <div class="social-links">
                                    <a href="https://purepick.vercel.app/">PurePick</a>
                                    <a href="https://github.com/devendrasuryavanshi">Gtithub</a>
                                    <a href="https://www.linkedin.com/in/devendrasuryavanshi/">LinkedIn</a>
                                </div>
                                <p style="margin-top: 20px;">© ${new Date().getFullYear()} PurePick. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `
        };

        const res = await transporter.sendMail(mailOptions);

        if (res.accepted.length > 0) {
            const hashedOTP = await bcrypt.hash(otp, 10);
            const isSaved = saveOrUpdateOtp({ email, hashedOTP, type });

            if (!isSaved) {
                return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
            }

            return NextResponse.json({ status: 200 });
        } else {
            return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}