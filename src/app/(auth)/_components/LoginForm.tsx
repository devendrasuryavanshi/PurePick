"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GoogleButton } from "./GoogleButton";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { redirectToPrevious } from "@/utils/redirectToPrevious";
import { Link } from "@nextui-org/react";


interface FormData {
    email: string;
    password: string;
    type: 'login' | 'signup';
}

export function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        type: 'login'
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password, type } = formData;
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            type
        });
        if (res?.error) {
            alert("Error: " + res.error);
        } else {
            redirectToPrevious();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleEyeClick = () => {
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;

        if (passwordInput) {
            setShowPassword((prevShowPassword) => !prevShowPassword);
            setTimeout(() => {
                if (passwordInput) {
                    passwordInput.focus();
                    passwordInput.setSelectionRange(passwordInput.value.length, passwordInput.value.length);
                }
            }, 0);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gray-200 dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                Login to PurePick
            </h2>

            <form className="my-4" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        required
                        name="email"
                        id="email"
                        placeholder="doraemon@gmail.com"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative w-full">
                        <Input
                            required
                            name="password"
                            onBlur={() => setShowPassword(false)}
                            id="password"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pr-10"
                        />
                        <div
                            className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:dark:text-gray-200 hover:text-gray-800 cursor-pointer"
                            onClick={() => handleEyeClick()}
                        >
                            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                        </div>
                    </div>
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    Login &rarr;
                    <BottomGradient />
                </button>
                <p className="pl-2 text-sm mt-4">Don&apos;t have an account? <Link className="text-sm" underline="hover" href="/signup">Sign up</Link></p>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-col space-y-4">
                    <GoogleButton />
                </div>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};