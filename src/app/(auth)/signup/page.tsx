"use client"
import React from 'react';
import { HeroHighlight } from '@/components/ui/hero-highlight';
import { SignupForm } from '../_components/SignupForm';

const Signup = () => {
    return (
        <HeroHighlight>
            <SignupForm/>
        </HeroHighlight>
    );
};

export default Signup;