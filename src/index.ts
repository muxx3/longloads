function formatDate(date: Date) {
  const day = date.getUTCDate().toString().padStart(2, "0");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthShort = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}-${monthShort}-${year}`;
}

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    const allowedOrigins = [
      "http://localhost:3000",
      "https://longloads.com",
    ];
    const origin = request.headers.get("Origin") || "";
    const corsOrigin = allowedOrigins.includes(origin) ? origin : "null";

    if (url.pathname === "/bar1") {
      const START_TIMESTAMP = 1751923200;
      const YEARS_TO_FINISH = 1_000_000;
      const SECONDS_PER_YEAR = 31_557_600;
      const TOTAL_DURATION_SECONDS = YEARS_TO_FINISH * SECONDS_PER_YEAR;
      const now = Math.floor(Date.now() / 1000);
      const elapsed = Math.max(now - START_TIMESTAMP, 0);
      const progress = Math.min(elapsed / TOTAL_DURATION_SECONDS, 1);
      const estimatedFinishYear = 2025 + YEARS_TO_FINISH;
      const estimatedFinishStr = `08-July-${estimatedFinishYear}`;

      return new Response(
        JSON.stringify({
          progress,
          estimated_finish: estimatedFinishStr,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": corsOrigin,
          },
        }
      );
    }

	if (url.pathname === "/bar2") {
		const startDate = new Date(Date.UTC(2025, 6, 8, 0, 0, 0));

		const estimatedFinishDate = new Date(startDate.getTime());
		estimatedFinishDate.setUTCFullYear(startDate.getUTCFullYear() + 100);

		console.log("Start date (UTC):", startDate.toISOString());
		console.log("Estimated finish date (UTC):", estimatedFinishDate.toISOString());

		const now = new Date();

		const totalDurationMs = estimatedFinishDate.getTime() - startDate.getTime();
		const elapsedMs = now.getTime() - startDate.getTime();

		const progress = Math.min(Math.max(elapsedMs / totalDurationMs, 0), 1);

		const estimatedFinishStr = formatDate(estimatedFinishDate);

		return new Response(
			JSON.stringify({
				progress,
				estimated_finish: estimatedFinishStr,
			}),
			{
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": corsOrigin,
				},
			}
		);
	}

    if (url.pathname === "/bar3") {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const totalSeconds = (endOfDay.getTime() - startOfDay.getTime()) / 1000;
      const elapsedSeconds = (now.getTime() - startOfDay.getTime()) / 1000;
      const progress = Math.min(elapsedSeconds / totalSeconds, 1);

      const estimatedFinishStr = formatDate(endOfDay);

      return new Response(
        JSON.stringify({
          progress,
          estimated_finish: estimatedFinishStr,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": corsOrigin,
          },
        }
      );
    }

	if (url.pathname === "/bar4") {
		const startDate = new Date(Date.UTC(2025, 0, 0, 0, 0, 0));

		const estimatedFinishDate = new Date(startDate.getTime());
		estimatedFinishDate.setUTCFullYear(startDate.getUTCFullYear() + 1);

		console.log("Start date (UTC):", startDate.toISOString());
		console.log("Estimated finish date (UTC):", estimatedFinishDate.toISOString());

		const now = new Date();

		const totalDurationMs = estimatedFinishDate.getTime() - startDate.getTime();
		const elapsedMs = now.getTime() - startDate.getTime();

		const progress = Math.min(Math.max(elapsedMs / totalDurationMs, 0), 1);

		const estimatedFinishStr = formatDate(estimatedFinishDate);

		return new Response(
			JSON.stringify({
				progress,
				estimated_finish: estimatedFinishStr,
			}),
			{
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": corsOrigin,
				},
			}
		);
	}

	if (url.pathname === "/bar5") {
		const now = Date.now();
		return new Response(
			JSON.stringify({
				start_time_ms: now,
				duration_ms: 1000,
			}),
			{
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": corsOrigin,
				},
			}
		);
	}



    return new Response("Not found", { status: 404 });
  },
};

