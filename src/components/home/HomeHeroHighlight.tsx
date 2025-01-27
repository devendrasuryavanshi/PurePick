"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import HeroButton from "./HeroButton";

interface HomeHeroHighlightProps {
    onOpen: () => void;
}

export const HomeHeroHighlight = ({ onOpen }: HomeHeroHighlightProps) => {
    return (
        <HeroHighlight>
            <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-3xl md:text-5xl lg:text-7xl font-bold text-center text-default-foreground"
                >
                    Decode Your Products,
                    <Highlight className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent px-4 block mt-2">
                        Protect Your Health
                    </Highlight>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 text-center max-w-3xl space-y-4"
                >
                    <span className="block">
                        Instantly reveal what&apos;s hiding in your everyday products. Our advanced scanner breaks down ingredients, rates health impact, and empowers your choices.
                    </span>
                    <span className="block font-medium text-black dark:text-white">
                        Because what you don&apos;t know CAN affect you.
                    </span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-4"
                >
                    <HeroButton onOpen={onOpen} />
                </motion.div>
            </div>
        </HeroHighlight>
    );
}
