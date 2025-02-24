"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [user, setUser] = useState(null);

  

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      router.push("/Login");
    } else {
      setUser(loggedInUser);
      loadEntries(loggedInUser.email);
    }
  }, [router]);

  const loadEntries = (email) => {
    try {
      const savedEntries = JSON.parse(localStorage.getItem(`journalEntries_${email}`)) || [];
      setEntries(savedEntries);
    } catch (error) {
      console.error("Error loading entries from localStorage", error);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(`journalEntries_${user.email}`, JSON.stringify(entries));
    }
  }, [entries, user]);

  const addEntry = () => {
    if (!text.trim()) return;
    const timestamp = new Date().toLocaleString(); // บันทึกวันที่และเวลา
    const newEntry = { id: Date.now(), text, timestamp };
    setEntries([newEntry, ...entries]);
    setText("");
    setShowInput(false);
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    if (updatedEntries.length === 0) {
      localStorage.removeItem(`journalEntries_${user.email}`);
    }
  };

  return (
    <div className="flex flex-col pt-6 dark:bg-gray-700 h-screen">
      <div className="pb-[90px] px-6 max-h-[calc(100vh-120px)] overflow-auto pt-4">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">No entries yet. Start writing!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="relative p-4 shadow-md dark:bg-gray-800 break-words transition-all hover:scale-[1.02]">
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
                >
                  <X size={16} />
                </button>
                <CardContent className="dark:text-white">
                  <p className="text-sm text-gray-400 dark:text-gray-300">{entry.timestamp}</p>
                  <p className="pt-1">{entry.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col items-end">
        {showInput && (
          <Card className="p-5 shadow-md w-[22rem] md:w-[26rem] mb-4 transition-all animate-fadeIn">
            <CardContent className="flex flex-col items-center">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={addEntry} className="mt-3 w-full">Save</Button>
            </CardContent>
          </Card>
        )}

        <button
          onClick={() => setShowInput(!showInput)}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
}
