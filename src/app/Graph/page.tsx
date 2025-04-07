"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

export default function GraphPage() {
  const [data, setData] = useState<
    { name: string; sentimentScore: number }[]
  >([]);

  // แปลง sentiment เป็นตัวเลข
  const sentimentToScore = (sentiment: string) => {
    switch (sentiment) {
      case "Negative":
        return -1;
      case "Neutral":
        return 0;
      case "Positive":
        return 1;
      default:
        return 0;
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/logs")
      .then((res) => {
        const transformed = res.data.map((entry: any, index: number) => ({
          name: `#${index + 1}`, // หรือใช้ timestamp ถ้าอยากละเอียด
          sentimentScore: sentimentToScore(entry.sentiment),
        }));
        setData(transformed);
      })
      .catch((err) => {
        console.error("Failed to fetch logs:", err);
      });
  }, []);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100 dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-center">Sentiment Graph</h1>
      <div className="w-full max-w-4xl h-96 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              domain={[-1, 1]}
              ticks={[-1, 0, 1]}
              tickFormatter={(tick) =>
                tick === 1
                  ? "Positive"
                  : tick === 0
                  ? "Neutral"
                  : "Negative"
              }
            />
            <Tooltip
              formatter={(value: number) =>
                value === 1
                  ? "Positive"
                  : value === 0
                  ? "Neutral"
                  : "Negative"
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sentimentScore"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
