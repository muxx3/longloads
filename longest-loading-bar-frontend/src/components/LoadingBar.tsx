"use client";

import React, { useState, useEffect, useRef } from "react";
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

  const startTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function updateWidth() {
      const maxWidth = 800;
	  const padding = 32;
      const availableWidth = window.innerWidth - padding * 2;
      setBarWidth(Math.min(maxWidth, availableWidth));
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const duration = 1000;

    // Clear existing timers with null checks
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

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
      intervalIdRef.current = setInterval(updateLocalDay, 1000);

      return () => {
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      };
    }

    if (mode === "server" && endpoint) {
      if (endpoint.endsWith("/bar5")) {
        const fetchStartTime = async () => {
          try {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Network response was not ok");
            const data = await res.json();
            startTimeRef.current = data.start_time_ms;
            setFinishDate("1 second cycle");
          } catch (error) {
            console.error("Error fetching start time:", error);
          }
        };

        fetchStartTime();
        intervalIdRef.current = setInterval(fetchStartTime, 1000);

        const animate = () => {
          const now = Date.now();
          const elapsed = (now - startTimeRef.current) % duration;
          const newProgress = elapsed / duration;
          setProgress(newProgress);
          animationFrameIdRef.current = requestAnimationFrame(animate);
        };

        animationFrameIdRef.current = requestAnimationFrame(animate);

        return () => {
          if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          if (animationFrameIdRef.current !== null) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
          }
        };
      }

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
      intervalIdRef.current = setInterval(fetchProgress, 1000);

      return () => {
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      };
    }
  }, [endpoint, mode]);

  const percentStr = (progress * 100).toFixed(15) + " % complete";

  let formattedDate = "Loading...";
  if (finishDate) {
    formattedDate = finishDate;
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

