"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { useEffect } from "react";

const ThemedToaster = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-center"
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <SessionProvider>
          {children}
          <ThemedToaster />
        </SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
