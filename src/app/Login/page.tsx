"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert(`Logging in with: ${email} / ${password}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-[48rem] h-[32rem] p-12 shadow-xl dark:bg-gray-800 relative -translate-y-8 flex flex-col justify-center">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Login</CardTitle>
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
          <div className="flex flex-col space-y-4">
            <Button onClick={handleLogin} className="w-full h-14 text-lg">
              Login
            </Button>
            <Link href="/Register" className="w-full">
              <Button variant="outline" className="w-full h-14 text-lg">
                Register
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
