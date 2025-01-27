'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import { Button, Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IconSearch, IconBulb, IconLock, IconWorld, IconBrain, IconLanguage, IconRobot, IconLeaf, IconHeart, IconRecycle } from '@tabler/icons-react';

const AboutPage = () => {
    const router = useRouter();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 text-default-foreground">
            {/* Hero Section */}
            <motion.div className="relative min-h-[60vh] md:h-[70vh] w-full flex items-center justify-center overflow-hidden py-10 md:py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40" />
                </div>
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <motion.h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        About PurePick
                    </motion.h1>
                    <motion.p className="text-lg md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
                        Your AI-powered companion for making informed decisions about personal care products
                    </motion.p>
                </div>
            </motion.div>

            {/* Vision & Mission */}
            <motion.section className="py-10 md:py-20 mx-4 md:mx-auto md:px-40 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <div>
                        <h2 className="text-4xl font-bold mb-8">Our Vision</h2>
                        <p className="text-lg leading-relaxed mb-6">
                            At PurePick, we envision a world where every individual can make confident decisions about their personal care products. We believe that understanding what goes into your products shouldn&apos;t require a degree in chemistry.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Our AI-driven platform democratizes access to product information, making it accessible and understandable for everyone, regardless of their background in health sciences.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
                        <p className="text-lg leading-relaxed mb-6">
                            We&apos;re on a mission to revolutionize how people interact with personal care products. By combining cutting-edge AI technology with personalized health profiles, we provide tailored insights that matter to you.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Every scan, every analysis, and every recommendation brings us closer to our goal of making product transparency the new normal in personal care.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <motion.div className="py-10 md:py-20 max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">How PurePick Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {[
                        {
                            step: "01",
                            title: "Scan Product",
                            description: "Simply scan any product using your device's camera"
                        },
                        {
                            step: "02",
                            title: "Analysis",
                            description: "Our advanced system analyzes ingredients and matches with your health profile"
                        },
                        {
                            step: "03",
                            title: "Get Insights",
                            description: "Receive personalized recommendations and alternatives"
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="relative"
                            whileHover={{ y: -10 }}
                        >
                            <span className="text-8xl font-bold text-gray-100 dark:text-gray-800 absolute -top-10 -left-6 z-0">
                                {item.step}
                            </span>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Impact Section */}
            <motion.section className="py-10 md:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">Making a Difference</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent">
                            <IconHeart className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-3xl font-semibold mb-6">Health Impact</h3>
                            <p className="text-lg leading-relaxed mb-6">
                                By identifying potentially harmful ingredients and suggesting safer alternatives, we&apos;ve helped thousands of users avoid products that could trigger allergic reactions or health concerns.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Our personalized recommendations have contributed to better health outcomes and increased awareness about product ingredients.
                            </p>
                        </Card>
                        <Card className="p-8 bg-gradient-to-br from-secondary/5 to-transparent">
                            <IconLeaf className="w-12 h-12 text-secondary mb-4" />
                            <h3 className="text-3xl font-semibold mb-6">Environmental Impact</h3>
                            <p className="text-lg leading-relaxed mb-6">
                                We promote environmentally conscious products and help users identify eco-friendly alternatives, contributing to sustainability in the personal care industry.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Through our platform, we&apos;ve facilitated the shift towards more sustainable and environmentally responsible product choices.
                            </p>
                        </Card>
                    </div>
                </div>
            </motion.section>

            {/* Values Section */}
            <motion.section className="py-10 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">Our Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            {
                                title: "Transparency",
                                description: "We believe in complete honesty about our technology and recommendations.",
                                icon: <IconSearch className="w-8 h-8" />
                            },
                            {
                                title: "Innovation",
                                description: "Continuously pushing the boundaries of what's possible with AI technology.",
                                icon: <IconBulb className="w-8 h-8" />
                            },
                            {
                                title: "Privacy",
                                description: "Your personal health data is always protected and secure.",
                                icon: <IconLock className="w-8 h-8" />
                            },
                            {
                                title: "Accessibility",
                                description: "Making advanced product analysis available to everyone.",
                                icon: <IconWorld className="w-8 h-8" />
                            }
                        ].map((value, index) => (
                            <Card
                                key={index}
                                className="p-6 bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10"
                                isPressable
                                isHoverable
                            >
                                <div className="text-primary mb-4">{value.icon}</div>
                                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Future Vision */}
            <motion.section className="py-10 md:py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Looking Ahead</h2>
                    <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
                        We&apos;re constantly evolving our technology to provide even more accurate and personalized insights. Our roadmap includes expanding our product database, enhancing our AI capabilities, and developing new features to better serve our community.
                    </p>
                    <Button
                        size="lg"
                        color="primary"
                        className="font-semibold w-full md:w-auto"
                        onClick={() => router.push('/signup')}
                    >
                        Join Our Journey
                    </Button>
                </div>
            </motion.section>
        </div>
    );
};

export default AboutPage;
