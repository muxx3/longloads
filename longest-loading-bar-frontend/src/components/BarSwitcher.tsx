"use client";

import React, { useState, useEffect, useCallback } from "react";
import LoadingBar from "@/components/LoadingBar";

export default function BarSwitcher() {
  const [baseURL, setBaseURL] = useState("https://longest-loading-bar-backend.muxxe-dev.workers.dev");

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setBaseURL("http://127.0.0.1:8787");
    }
  }, []);

  const bars = React.useMemo(() => [
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
	{
		title: "Current Year",
		endpoint: `${baseURL}/bar4`,
		mode: "server",
	}
  ], [baseURL]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const switchNextBar = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bars.length);
  }, [bars.length]);

  const switchPrevBar = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + bars.length) % bars.length);
  }, [bars.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k") {
        switchNextBar();
      } else if (e.key === "j") {
        switchPrevBar();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [switchNextBar, switchPrevBar]);

  const currentBar = bars[currentIndex];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={switchNextBar}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          switchNextBar();
        }
      }}
      className="cursor-pointer select-none"
      aria-label="Switch loading bar. Tap or press j/k keys to change."
    >
      <div className="text-center font-share-tech-mono text-white mb-10">
        Use <kbd>j</kbd>/<kbd>k</kbd> keys or tap here to switch
      </div>
      <LoadingBar
        endpoint={currentBar.endpoint}
        mode={currentBar.mode as "server" | "localDay"}
        title={currentBar.title}
      />
    </div>
  );
}

