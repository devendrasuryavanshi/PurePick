"use client"
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input, Button } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
import 'tailwindcss/tailwind.css';
import { HeroHighlight } from '@/components/ui/hero-highlight';
import { SignupForm } from '../_components/SignupForm';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <HeroHighlight>
            <SignupForm/>
        </HeroHighlight>
    );
};

export default Signup;