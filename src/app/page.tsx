"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    setEntries(savedEntries);
  }, []);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (text.trim() === "") return;
    const newEntry = { id: Date.now(), text };
    setEntries([newEntry, ...entries]);
    setText("");
  };

  return (
    <div>
      <div className="pb-[90px] px-6 max-h-[calc(100vh-120px)] overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-4 shadow-md dark:bg-gray-800 break-words">
              <CardContent>{entry.text}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-4 shadow-md flex justify-center">
        <Card className="p-5 shadow-md w-[32rem] md:w-[38rem]">
          <CardContent className="flex flex-col items-center">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-3/4 md:w-2/3 p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
            />
            <Button onClick={addEntry} className="mt-3 w-3/4 md:w-2/3">Save Entry</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
