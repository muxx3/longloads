"use client";

import React, { useState, useEffect, useMemo } from "react";
import LoadingBar from "@/components/LoadingBar";

type Bar = {
  title: string;
  endpoint?: string;
  mode: "server" | "localDay";
};

export default function BarSwitcher() {
  const [baseURL, setBaseURL] = useState("https://longest-loading-bar.muxxe-dev.workers.dev");

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setBaseURL("http://127.0.0.1:8787");
    }
  }, []);

  const bars: Bar[] = useMemo(() => [
    {
      title: "1 Million Years",
      endpoint: `${baseURL}/bar1`,
      mode: "server",
    },
    {
      title: "100 Years",
      endpoint: `${baseURL}/bar2`,
      mode: "server",
    },
    {
      title: "Local Day",
      mode: "localDay",
    },
  ], [baseURL]);

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
  }, [bars.length]);

  const currentBar = bars[currentIndex];

  return (
    <section tabIndex={0} aria-label="Loading bar switcher" className="outline-none">
      <div className="text-center font-share-tech-mono text-white mb-10">
        Use <kbd>j</kbd>/<kbd>k</kbd> to switch
      </div>
      <LoadingBar
        endpoint={currentBar.endpoint}
        mode={currentBar.mode}
        title={currentBar.title}
      />
    </section>
  );
}

