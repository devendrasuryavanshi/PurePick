"use client"
import React from 'react'
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const HeroButton = ({ onOpen }) => {
    const { data: session, status } = useSession();
    return (
        status === "loading" ? ('') : status === 'authenticated' ?
        (
        <button onClick={onOpen} className="mt-8 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-offset-2 focus:ring-offset-black">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-lg font-medium text-white backdrop-blur-3xl">
                Start Analysis
            </span>
        </button>
        ) :
        (
            <Link href="/login" className="mt-8 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-offset-2 focus:ring-offset-black">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-lg font-medium text-white backdrop-blur-3xl">
                    Get Started
                </span>
            </Link>
        )
    )
}

export default HeroButton;