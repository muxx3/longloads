import rough from "roughjs/bin/rough";
import React, { useEffect, useRef } from "react";

export default function SketchLoadingBar({ progress }: { progress: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rcRef = useRef<ReturnType<typeof rough.svg>>();

  const width = 800;
  const height = 30;

  // Create rc and draw outline once
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = ""; // clear just in case

    const rc = rough.svg(svg);
    rcRef.current = rc;

    // Outline (rounded path)
    const radius = 5;
    const roundedPath: [number, number][] = [
      [radius, 0],
      [width - radius, 0],
      [width, radius],
      [width, height - radius],
      [width - radius, height],
      [radius, height],
      [0, height - radius],
      [0, radius],
      [radius, 0],
    ];

    const sketchyOutline = rc.linearPath(roundedPath as [number, number][], {
      roughness: 0.5,
      stroke: "#ffffff",
      strokeWidth: 2,
    });
    svg.appendChild(sketchyOutline);

  }, []); // ← run ONCE

  // Draw / update fill every time progress changes
  useEffect(() => {
    if (!svgRef.current || !rcRef.current) return;

    const svg = svgRef.current;

    // Remove old fill rectangles
    const oldFills = svg.querySelectorAll(".bar-fill");
    oldFills.forEach(el => el.remove());

    // Gap
    const gap = 4;
    const innerWidth = width - 2 * gap;
    const innerHeight = height - 2 * gap;
    const filledWidth = Math.max(progress * innerWidth, 1);

    // Draw new fill
    const fill = rcRef.current.rectangle(
      gap,
      gap,
      filledWidth,
      innerHeight,
      {
        fill: "#ffffff",
        fillStyle: "solid",
        roughness: 0,
        strokeWidth: 1,
      }
    );
    fill.classList.add("bar-fill");
    svg.appendChild(fill);

  }, [progress]); // ← run every time progress changes

  return <svg ref={svgRef} width={width} height={height} />;
}

