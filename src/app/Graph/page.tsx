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
  const [average, setAverage] = useState<number | null>(null);

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

  const getSuggestionMessage = (avg: number) => {
    if (avg < -0.5) {
      return {
        text: "อารมณ์โดยรวมค่อนข้างติดลบ 😞 ลองพักผ่อน หรือหาเวลาทำสิ่งที่ตัวเองชอบดูนะครับ ❤️",
        color: "text-red-500",
      };
    } else if (avg < 0.5) {
      return {
        text: "อารมณ์โดยรวมค่อนข้างเป็นกลาง 🙂 ลองเติมพลังด้วยกิจกรรมเล็กๆ ที่ทำให้ยิ้มได้!",
        color: "text-yellow-500",
      };
    } else {
      return {
        text: "บรรยากาศดูเป็นบวกมาก! 😊 ยอดเยี่ยมไปเลย! อย่าลืมแบ่งพลังบวกให้คนรอบข้างด้วยนะ ✨",
        color: "text-green-500",
      };
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/logs")
      .then((res) => {
        const transformed = res.data.map((entry: any, index: number) => ({
          name: new Date(entry.timestamp).toLocaleTimeString(),
          sentimentScore: sentimentToScore(entry.sentiment),
        }));
        setData(transformed);

        if (transformed.length > 0) {
          const avg =
            transformed.reduce((sum, item) => sum + item.sentimentScore, 0) /
            transformed.length;
          setAverage(avg);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch logs:", err);
      });
  }, []);

  const suggestion = average !== null ? getSuggestionMessage(average) : null;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Sentiment Trend Graph
      </h1>

      <div className="w-full max-w-4xl h-96 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl">
        {data.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No sentiment data available yet.
          </p>
        ) : (
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
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {suggestion && (
        <div className="mt-6 p-4 max-w-2xl text-center bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <p className={`text-lg font-medium ${suggestion.color}`}>
            {suggestion.text}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            (คะแนนเฉลี่ยความรู้สึก: {average!.toFixed(2)})
          </p>
        </div>
      )}
    </div>
  );
}
