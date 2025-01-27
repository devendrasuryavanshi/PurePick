"use client"
import { Button, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { ThemeSwitcher } from "../components/theme-switcher/ThemeSwitcher";
import { HomeHeroHighlight } from "../components/home/HomeHeroHighlight";
import HeroTracingBeam from "../components/home/TracingBeam";
import ScannerModal from "../components/scanner/ScannerModal";

const Home = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="bg-white dark:bg-black">
      <HomeHeroHighlight onOpen={onOpen} />
      <HeroTracingBeam />
      <ScannerModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}

export default Home;