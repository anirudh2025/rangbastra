const CANVA_EXPORT_URL = "https://api.canva.com/rest/v1/exports";
const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 8000;

export const createCanvaPngExport = async ({
  accessToken,
  designId,
  page,
  quality = "pro",
}) => {
  const createResponse = await fetch(CANVA_EXPORT_URL, {
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

  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (job.status === "in_progress" && Date.now() < deadline) {
    await new Promise((resolve) =>
      setTimeout(resolve, POLL_INTERVAL_MS),
    );

    const statusResponse = await fetch(
      `${CANVA_EXPORT_URL}/${encodeURIComponent(job.id)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!statusResponse.ok) {
      return {
        status: "provider_error",
        providerStatus: statusResponse.status,
      };
    }
    job = (await statusResponse.json())?.job;
  }

  if (job?.status === "success" && typeof job.urls?.[0] === "string") {
    return { status: "success", downloadUrl: job.urls[0] };
  }

  if (job?.status === "failed") return { status: "failed" };
  return { status: "timeout" };
};
