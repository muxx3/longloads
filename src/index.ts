export interface Env {}

const START_TIMESTAMP = 1688160000; // example start time (July 1, 2023 UTC)
const TOTAL_DURATION_SECONDS = 600_000_000; // ~1 million years

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const now = Math.floor(Date.now() / 1000);

    const elapsed = Math.max(now - START_TIMESTAMP, 0);
    const progress = Math.min(elapsed / TOTAL_DURATION_SECONDS, 1);

    const estimatedFinish = new Date((START_TIMESTAMP + TOTAL_DURATION_SECONDS) * 1000).toISOString();

    return new Response(
      JSON.stringify({
        progress,
        estimated_finish: estimatedFinish,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
};

