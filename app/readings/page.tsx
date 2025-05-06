"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const space_grotesk = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

export default function Page() {
  const [glucose, setGlucose] = useState({
    reading: 100,
    arrow: "t",
    date: new Date(),
  });

  useEffect(() => {
    const fetchData = () => {
      invoke<string[]>("get_most_recent_reading").then((g) => {
        setGlucose({
          reading: parseInt(g[0]),
          arrow: g[1],
          date: new Date(g[2]),
        });
      });
    };

    fetchData();

    // updates every 3 minutes
    const intervalId = setInterval(fetchData, 180000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 className={cn("text-9xl text-center pt-28", space_grotesk.className)}>
        {glucose.arrow === "t" ? (
          "..."
        ) : (
          <span
            className={cn(
              glucose.reading <= 70 && "text-red-500",
              glucose.reading > 70 && glucose.reading < 200 && "text-green-500",
              glucose.reading > 200 && "text-yellow-500"
            )}
          >
            {glucose.reading} {glucose.arrow}
          </span>
        )}
      </h1>
      <p
        className={cn(
          "text-xl text-center pt-4 text-muted-foreground",
          space_grotesk.className
        )}
      >
        Last Reading: {glucose.date.toLocaleString()}
      </p>
    </div>
  );
}
