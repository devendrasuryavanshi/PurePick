import { Brain } from 'lucide-react';
import React from 'react';

export const SignupBenefits = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center gap-8 p-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Create Your PurePick Account
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-300">
                    Get instant AI-powered insights for all your product choices                    </p>
            </div>

            <div className="grid gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-default-foreground">Quick Registration</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Sign up in less than 2 minutes</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/30">
                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-default-foreground">Secure Account</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Your data is protected with us</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/30">
                        <Brain className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-default-foreground">AI-Powered Analysis</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Get detailed insights about ingredients and safety</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Join our growing community of health-conscious consumers
                </p>
            </div>
        </div>
    );
};