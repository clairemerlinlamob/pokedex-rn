import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";
import { useLanguage } from "./context/LanguageContext";
import i18n from "./i18n";
import type { ReactNode } from "react";

function LanguageInitializer({ children }: { children: ReactNode }) {
  const { language } = useLanguage();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return <>{children}</>;
}

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <LanguageInitializer>
            <Stack screenOptions={{ headerShown: false }} />
          </LanguageInitializer>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
