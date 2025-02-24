"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const user = { email, password };
    localStorage.setItem("user", JSON.stringify(user)); // บันทึกข้อมูลใน localStorage
    alert("Registration successful!");
    router.push("/Login"); // ไปหน้า Login
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-[48rem] h-[36rem] p-12 shadow-xl dark:bg-gray-800 relative -translate-y-6 flex flex-col justify-center">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Register</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 text-lg border rounded-md dark:bg-gray-700"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 text-lg border rounded-md dark:bg-gray-700"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-4 text-lg border rounded-md dark:bg-gray-700"
          />
          <div className="flex flex-col space-y-4">
            <Button onClick={handleRegister} className="w-full h-14 text-lg">
              Register
            </Button>
            <Link href="/Login" className="w-full">
              <Button variant="outline" className="w-full h-14 text-lg">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
