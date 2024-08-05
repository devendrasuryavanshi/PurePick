"use client"
import { Button, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { ThemeSwitcher } from "./components/ThemeSwitcher/ThemeSwitcher";
import { HomeHeroHighlight } from "./components/Home/HomeHeroHighlight";
import { HeroCarousel } from "./components/Home/Carousel";
import HeroTracingBeam from "./components/Home/TracingBeam";
import ScannerModal from "./components/ScanAndCheck/ScannerModal";

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="bg-white dark:bg-black">
      <HomeHeroHighlight onOpen={onOpen} />
      <HeroTracingBeam />
      <HeroCarousel />
      <ScannerModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
