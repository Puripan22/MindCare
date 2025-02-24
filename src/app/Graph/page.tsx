"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Graph() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const addDataPoint = () => {
    if (name.trim() === "" || isNaN(Number(value))) return;
    setData([...data, { name, value: Number(value) }]);
    setName("");
    setValue("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Graph Visualization</h1>

      {/* Input Section */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Input
          type="text"
          placeholder="Label (e.g., Day 1)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-40"
        />
        <Input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-40"
        />
        <Button onClick={addDataPoint}>Add Data</Button>
      </div>

      {/* Graph Section */}
      <div className="w-full max-w-3xl h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
