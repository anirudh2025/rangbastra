const firstQueryValue = (value) =>
  Array.isArray(value) ? value[0] : value;

export default function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).send("Method not allowed.");
  }

  const code = firstQueryValue(request.query?.code);
  const state = firstQueryValue(request.query?.state);
  const error = firstQueryValue(request.query?.error);

  // State is accepted now so it can be validated when token exchange is added.
  void state;

  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "text/plain; charset=utf-8");

  if (error) {
    return response
      .status(400)
      .send(`Canva authorization failed: ${error}`);
  }

  if (!code) {
    return response
      .status(400)
      .send("Canva authorization callback is missing the code parameter.");
  }

  return response
    .status(200)
    .send("Canva authorization callback received successfully.");
}
