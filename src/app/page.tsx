"use client"
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { ThemeSwitcher } from "./components/ThemeSwitcher/ThemeSwitcher";

export default function Home() {
  return (
    <div className="bg-white dark:bg-black">
      <h1>Hello World</h1>
      <p>This is the service we provide</p>
      <Button>Click Me</Button>
    </div>
  );
}
