// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner"; // Import Toaster
import { useEffect } from "react";

// Custom component to wrap Toaster
const ThemedToaster = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <Toaster
      position="top-center"
      theme={theme === "dark" ? "dark" : "light"} // Set theme based on current theme
    />
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <SessionProvider>
          {children}
          <ThemedToaster /> {/* Use the ThemedToaster here */}
        </SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
