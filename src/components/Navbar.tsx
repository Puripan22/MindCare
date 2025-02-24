"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);

  // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(loggedInUser);
  }, []);

  // ฟังก์ชันล็อกเอาต์
  const logout = () => {
    localStorage.removeItem("loggedInUser"); // ลบข้อมูลผู้ใช้ที่ล็อกอิน
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("journalEntries_")) {
        localStorage.removeItem(key); // ลบ journal entries ของผู้ใช้
      }
    });

    setUser(null); // อัปเดต state ให้เป็น null
    router.push("/Login"); // กลับไปที่หน้า Login
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-4 shadow-md dark:bg-gray-800 bg-white z-10 flex justify-between items-center">
      {/* เมนูด้านซ้าย */}
      <div className="flex space-x-8">
        <Link href="/" className="text-xl font-semibold dark:text-white">Home</Link>
        <Link href="/Graph" className="text-lg dark:text-white">Graph</Link>
      </div>

      {/* เมนูด้านขวา */}
      <div className="flex items-center space-x-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center space-x-2">
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        </div>

        {/* แสดงชื่ออีเมลและปุ่ม Logout */}
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
            <Button onClick={logout} variant="outline" className="dark:bg-gray-700 dark:text-white">
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/Login">
            <Button variant="outline" onClick={() => setUser(JSON.parse(localStorage.getItem("loggedInUser")))}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
