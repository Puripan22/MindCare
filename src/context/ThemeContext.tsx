"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean | null>(null); // ใช้ `null` เพื่อรอค่าเริ่มต้น

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("darkMode") === "true";
      setDarkMode(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme);
    }
  }, []);

  useEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem("darkMode", darkMode.toString());
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ถ้า darkMode ยังเป็น null ให้แสดง UI ว่างๆไปก่อนเพื่อป้องกัน UI กระพริบ
  if (darkMode === null) return <div className="h-screen bg-white dark:bg-gray-900" />;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
