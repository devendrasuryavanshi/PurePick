// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Github, Slack, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className="py-8 border-t-1 bg-gray-200 dark:bg-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-4 justify-between items-center">
                    <div className="flex gap-2 justify-center items-center mb-4 md:mb-0 cursor-pointer">
                        <Slack className="w-6 h-6" />
                        <span className="font-bold text-xl">PurePick</span>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-4 text-gray-400">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <Link href="/about" className="hover:text-blue-600">About</Link>
                        <Link href="/services" className="hover:text-blue-600">Services</Link>
                        <Link href="/projects" className="hover:text-blue-600">Projects</Link>
                        <Link href="/contact" className="hover:text-blue-600">Contact</Link>
                        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
                        <Link href="/careers" className="hover:text-blue-600">Careers</Link>
                    </nav>
                    <div className="flex gap-4 text-gray-400">
                        {/* LinkedIn, instagram, twitter, Github */}
                        <Link href="https://linkedin.com/">
                            <Linkedin className="w-6 h-6 hover:text-gray-300" />
                        </Link>
                        <Link href="https://instagram.com/">
                            <Instagram className="w-6 h-6 hover:text-gray-300" />
                        </Link>
                        <Link href="https://twitter.com/">
                            <Twitter className="w-6 h-6 hover:text-gray-300" />
                        </Link>
                        <Link href="https://github.com/">
                            <Github className="w-6 h-6 hover:text-gray-300" />
                        </Link>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} PurePick. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;