"use client";

import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="fixed top-0 left-0 w-full p-4 shadow-md dark:bg-gray-800 bg-white z-10 flex justify-between items-center">
      <div className="flex space-x-8">
        <Link href="/" className=" text-xl font-semibold">Home</Link>
        <Link href="/Graph" className="text-lg ">Graph</Link>
        <Link href="/Login" className="text-lg ">Login</Link>
      </div>
      <div className="flex items-center space-x-2">
        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
      </div>
    </nav>
  );
}
