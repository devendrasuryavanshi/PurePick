"use client"
import React from 'react';
import { HeroHighlight } from '@/components/ui/hero-highlight';
import { LoginForm } from '@/components/auth/login/LoginForm';

const Login = () => {

    return (
        <HeroHighlight>
            <LoginForm/>
        </HeroHighlight>
    );
};

export default Login;