const CANVA_EXPORT_URL = "https://api.canva.com/rest/v1/exports";
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 120000;

const jobStatus = (job) =>
  typeof job?.status === "string" ? job.status : "unknown";

const resultWithPolling = (status, job, startedAt, pollCount, now) => ({
  status,
  jobStatus: jobStatus(job),
  elapsedMs: Math.max(0, now() - startedAt),
  pollCount,
});

export const createCanvaPngExport = async ({
  accessToken,
  designId,
  page,
  quality = "pro",
  fetchImpl = fetch,
  now = Date.now,
  sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds)),
  pollIntervalMs = POLL_INTERVAL_MS,
  pollTimeoutMs = POLL_TIMEOUT_MS,
}) => {
  const startedAt = now();
  const createResponse = await fetchImpl(CANVA_EXPORT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      design_id: designId,
      format: {
        type: "png",
        export_quality: quality,
        lossless: true,
        pages: [page],
      },
    }),
  });

  if (!createResponse.ok) {
    return {
      status: "provider_error",
      providerStatus: createResponse.status,
    };
  }

  let job = (await createResponse.json())?.job;
  if (!job?.id) return { status: "invalid_response" };

  const deadline = startedAt + pollTimeoutMs;
  let pollCount = 0;
  while (job.status === "in_progress") {
    const remaining = deadline - now();
    if (remaining <= 0) {
      return resultWithPolling(
        "timeout",
        job,
        startedAt,
        pollCount,
        now,
      );
    }

    await sleep(Math.min(pollIntervalMs, remaining));
    if (now() >= deadline) {
      return resultWithPolling(
        "timeout",
        job,
        startedAt,
        pollCount,
        now,
      );
    }

    const statusResponse = await fetchImpl(
      `${CANVA_EXPORT_URL}/${encodeURIComponent(job.id)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    pollCount += 1;
    if (!statusResponse.ok) {
      return {
        status: "provider_error",
        providerStatus: statusResponse.status,
      };
    }
    job = (await statusResponse.json())?.job;
  }

  if (job?.status === "success" && typeof job.urls?.[0] === "string") {
    return {
      ...resultWithPolling(
        "success",
        job,
        startedAt,
        pollCount,
        now,
      ),
      downloadUrl: job.urls[0],
    };
  }

  if (job?.status === "failed") {
    return resultWithPolling(
      "failed",
      job,
      startedAt,
      pollCount,
      now,
    );
  }
  return resultWithPolling(
    "timeout",
    job,
    startedAt,
    pollCount,
    now,
  );
};
