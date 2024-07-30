// app/components/ThemeSwitcher.tsx
"use client";

import { Button } from "@nextui-org/react";
import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    console.log("theme")
    setMounted(true)
  }, [])

  if(!mounted) return null

  const toggleTheme = () => {
    setTheme(theme == 'light' ? 'dark' : 'light')
  }

  return (
      <div className="h-6 w-6 cursor-pointer hover:opacity-75 flex items-center justify-center" onClick={toggleTheme}>
        {theme == 'light' ? <MoonIcon className="text-gray-600 text-3xl"/> : <SunIcon className="text-3xl text-gray-300"/>}
      </div>
  )
};