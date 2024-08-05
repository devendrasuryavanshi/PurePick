"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import HeroButton from "./HeroButton";

interface HomeHeroHighlightProps {
  onOpen: () => void;
}

export function HomeHeroHighlight({ onOpen }: HomeHeroHighlightProps) {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        Make informed decisions about the <Highlight className="text-black dark:text-white"> safety and quality</Highlight> of every products.<br/>
        <HeroButton onOpen={onOpen} />
      </motion.h1>
      
    </HeroHighlight>
  );
}