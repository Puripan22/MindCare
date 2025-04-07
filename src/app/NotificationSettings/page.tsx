"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function NotificationSettings() {
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [savedTime, setSavedTime] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [permission, setPermission] = useState("default");

  // โหลดค่าจาก localStorage
  useEffect(() => {
    const storedTime = localStorage.getItem("notificationTime");
    const storedToggle = localStorage.getItem("notificationEnabled");

    if (storedTime) setNotificationTime(storedTime);
    if (storedTime) setSavedTime(storedTime);
    if (storedToggle !== null) setNotificationEnabled(storedToggle === "true");

    // ตรวจสอบ permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // ขอสิทธิ์แจ้งเตือน (ครั้งแรก)
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
      });
    }
  }, []);

  // บันทึกการตั้งค่า
  const handleSave = () => {
    localStorage.setItem("notificationTime", notificationTime);
    localStorage.setItem("notificationEnabled", notificationEnabled.toString());
    setSavedTime(notificationTime);

    alert("📌 บันทึกการตั้งค่าเรียบร้อยแล้ว!");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 dark:text-white">
        🛎 ตั้งค่าแจ้งเตือนประจำวัน
      </h1>

      {/* เวลาแจ้งเตือน */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700 dark:text-gray-300">
          เลือกเวลาแจ้งเตือน:
        </label>
        <input
          type="time"
          value={notificationTime}
          onChange={(e) => setNotificationTime(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* เปิด/ปิดแจ้งเตือน */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300">เปิดการแจ้งเตือน</span>
        <Switch
          checked={notificationEnabled}
          onCheckedChange={(checked) => setNotificationEnabled(checked)}
        />
      </div>

      {/* ปุ่มบันทึก */}
      <Button onClick={handleSave} className="w-full">
        บันทึกการตั้งค่า
      </Button>

      {/* สถานะ */}
      {savedTime && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          ⏰ เวลาที่ตั้งไว้ล่าสุด: <strong>{savedTime}</strong>
        </p>
      )}

      {permission !== "granted" && (
        <p className="mt-2 text-sm text-red-500">
          ⚠️ กรุณาอนุญาตการแจ้งเตือนจากเบราว์เซอร์เพื่อใช้งานฟีเจอร์นี้
        </p>
      )}
    </div>
  );
}
