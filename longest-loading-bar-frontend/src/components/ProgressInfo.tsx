"use client";

import { useTypewriter } from "@/components/useTypewriter";

export default function ProgressInfo({
  title,
  percentStr,
  formattedDate,
}: {
  title: string;
  percentStr: string;
  formattedDate: string;
}) {
  const staticText = `${title}\nEnd: ${formattedDate}`;
  const typedStatic = useTypewriter(staticText, 100, "/sounds/output.wav");

  return (
    <div
      className="fixed top-5 left-5 text-left text-white bg-black/80 p-3 rounded"
      style={{
        fontSize: "0.95rem",
        lineHeight: "1.5",
        whiteSpace: "pre-line",
      }}
    >
      {typedStatic}
      {"\n"}
      {percentStr}
    </div>
  );
}

