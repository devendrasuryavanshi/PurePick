// pages/404.js

import Link from "next/link";

export default function Custom404() {
    return (
        <div className="grid h-screen place-content-center bg-black px-4">
            <div className="text-center">
                <h1 className="text-9xl font-black text-gray-200">404</h1>

                <p className="text-2xl font-bold tracking-tight text-slate-200 sm:text-4xl">Uh-oh!</p>

                <p className="mt-4 text-gray-300">We cant find that page.</p>

                <Link href="/" className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}