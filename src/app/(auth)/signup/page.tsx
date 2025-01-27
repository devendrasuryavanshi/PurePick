"use client"
import React from 'react';
import { HeroHighlight } from '@/components/ui/hero-highlight';
import { SignupFormPage } from '@/components/auth/signup/SignupForm';

const Signup = () => {
    return (
        <HeroHighlight>
            <SignupFormPage/>
        </HeroHighlight>
    );
};

export default Signup;