"use client"
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { ThemeSwitcher } from "./components/ThemeSwitcher/ThemeSwitcher";
import { HomeHeroHighlight } from "./components/Home/HomeHeroHighlight";
import { HeroCarousel } from "./components/Home/Carousel";
import HeroTracingBeam from "./components/Home/TracingBeam";

export default function Home() {
  return (
    <div className="bg-white dark:bg-black">
      <HomeHeroHighlight />
      <HeroTracingBeam />
      <HeroCarousel/>
    </div>
  );
}
