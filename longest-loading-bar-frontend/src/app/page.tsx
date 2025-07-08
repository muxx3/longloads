"use client";

import React, { useState, useEffect } from "react";
import LoadingBar from "@/components/LoadingBar";

export default function Home() {
  const bars = [
    { title: "1 Million Years", endpoint: "http://localhost:8787/bar1", mode: "server" },
    { title: "100 Years", endpoint: "http://localhost:8787/bar2", mode: "server" },
    { title: "Local Day", mode: "localDay" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k") {
        setCurrentIndex((prev) => (prev + 1) % bars.length);
      } else if (e.key === "j") {
        setCurrentIndex((prev) => (prev - 1 + bars.length) % bars.length);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  },);

  const currentBar = bars[currentIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center font-[ShareTechMono] text-white mb-2">
        use j/k to switch
      </div>
      <LoadingBar endpoint={currentBar.endpoint} mode={currentBar.mode as "server" | "localDay"} title={currentBar.title} />
    </main>
  );
}

