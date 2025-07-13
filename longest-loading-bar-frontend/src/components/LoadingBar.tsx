"use client";

import React, { useState, useEffect } from "react";
import SketchLoadingBar from "./SketchLoadingBar";
import ProgressInfo from "./ProgressInfo";

type ProgressData = {
  progress: number;
  estimated_finish: string;
};

export default function LoadingBar({
  endpoint,
  mode,
  title,
}: {
  endpoint?: string;
  mode?: "server" | "localDay";
  title: string;
}) {
  const [progress, setProgress] = useState<number>(0);
  const [finishDate, setFinishDate] = useState<string>("");

  const [barWidth, setBarWidth] = useState<number>(800);

  useEffect(() => {
    function updateWidth() {
      const maxWidth = 800;
      const padding = 32; // adjust as needed for container padding
      const availableWidth = window.innerWidth - padding * 2;
      setBarWidth(Math.min(maxWidth, availableWidth));
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (mode === "localDay") {
      const updateLocalDay = () => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

        const totalSeconds = (endOfDay.getTime() - startOfDay.getTime()) / 1000;
        const elapsedSeconds = (now.getTime() - startOfDay.getTime()) / 1000;

        const localProgress = Math.min(elapsedSeconds / totalSeconds, 1);

        const day = endOfDay.getDate().toString().padStart(2, "0");
        const monthShort = endOfDay.toLocaleString("en-US", { month: "short" });
        const year = endOfDay.getFullYear();
        const estimatedFinishStr = `${day}-${monthShort}-${year}`;

        setProgress(localProgress);
        setFinishDate(estimatedFinishStr);
      };

      updateLocalDay();
      interval = setInterval(updateLocalDay, 1000);

      return () => clearInterval(interval);
    }

    if (mode === "server" && endpoint) {
      const fetchProgress = async () => {
        try {
          const res = await fetch(endpoint);
          if (!res.ok) throw new Error("Network response was not ok");
          const data: ProgressData = await res.json();
          setProgress(data.progress);
          setFinishDate(data.estimated_finish);
        } catch (error) {
          console.error("Error fetching progress:", error);
        }
      };

      fetchProgress();
      interval = setInterval(fetchProgress, 1000);

      return () => clearInterval(interval);
    }
  }, [endpoint, mode]);

  const percentStr = (progress * 100).toFixed(12) + " % complete";

  let formattedDate = "Loading...";
  if (finishDate) {
    const date = new Date(finishDate);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, "0");
      const monthShort = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      formattedDate = `${day}-${monthShort}-${year}`;
    } else {
      formattedDate = finishDate;
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8 py-4">
        <SketchLoadingBar progress={progress} width={barWidth} />
      </div>

      <ProgressInfo title={title} percentStr={percentStr} formattedDate={formattedDate} />
    </>
  );
}

