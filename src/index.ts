export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/bar1") {
      const START_TIMESTAMP = 1751958000;
      const YEARS_TO_FINISH = 1_000_000;
      const SECONDS_PER_YEAR = 31_557_600;
      const TOTAL_DURATION_SECONDS = YEARS_TO_FINISH * SECONDS_PER_YEAR;
      const now = Math.floor(Date.now() / 1000);
      const elapsed = Math.max(now - START_TIMESTAMP, 0);
      const progress = Math.min(elapsed / TOTAL_DURATION_SECONDS, 1);
      const estimatedFinishYear = 2025 + YEARS_TO_FINISH;
      const estimatedFinishStr = `08-July-${estimatedFinishYear}`;

      return new Response(JSON.stringify({
        progress,
        estimated_finish: estimatedFinishStr,
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://longloads.com",
        },
      });
    }

    if (url.pathname === "/bar2") {
      const START_TIMESTAMP = 1751958000;
      const YEARS_TO_FINISH = 100;
      const SECONDS_PER_YEAR = 31_557_600;
      const TOTAL_DURATION_SECONDS = YEARS_TO_FINISH * SECONDS_PER_YEAR;

      const now = Math.floor(Date.now() / 1000);
      const elapsed = Math.max(now - START_TIMESTAMP, 0);
      const progress = Math.min(elapsed / TOTAL_DURATION_SECONDS, 1);

      const estimatedFinishTimestamp = START_TIMESTAMP + TOTAL_DURATION_SECONDS;
      const estimatedFinishDate = new Date(estimatedFinishTimestamp * 1000);
      const day = estimatedFinishDate.getDate().toString().padStart(2, "0");
      const monthShort = estimatedFinishDate.toLocaleString("en-US", { month: "short" });
      const year = estimatedFinishDate.getFullYear();
      const estimatedFinishStr = `${day}-${monthShort}-${year}`;

      return new Response(JSON.stringify({
        progress,
        estimated_finish: estimatedFinishStr,
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://longloads.com",
		},
      });
    }

    if (url.pathname === "/bar3") {
      // Daily progress bar
      const now = new Date();

      // UTC midnight today
      const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
      // UTC midnight tomorrow
      const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));

      const totalSeconds = (endOfDay.getTime() - startOfDay.getTime()) / 1000;
      const elapsedSeconds = (now.getTime() - startOfDay.getTime()) / 1000;

      const progress = Math.min(elapsedSeconds / totalSeconds, 1);

      // Format estimated finish as midnight tomorrow
      const day = endOfDay.getUTCDate().toString().padStart(2, "0");
      const monthShort = endOfDay.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      const year = endOfDay.getUTCFullYear();
      const estimatedFinishStr = `${day}-${monthShort}-${year}`;

      return new Response(JSON.stringify({
        progress,
        estimated_finish: estimatedFinishStr,
      }), {
        headers: {
          "Content-Type": "application/json",
		  "Access-Control-Allow-Origin": "https://longloads.com",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

