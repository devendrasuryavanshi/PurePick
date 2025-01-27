import { History } from 'lucide-react';
import React from 'react';

export const LoginBenefits = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center gap-8 p-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome Back to PurePick
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-300">
                    Log in to unlock advanced product analysis and personalized insights
                </p>
            </div>

            <div className="grid gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-default-foreground">Secure Login</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Your account security is our priority</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/30">
                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-default-foreground">Personalized Experience</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Get recommendations based on your health profile</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <History className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-default-foreground">Scan History</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Track and review your analyzed products</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Join thousands of users making informed product choices with PurePick
                </p>
            </div>
        </div>
    );
};
