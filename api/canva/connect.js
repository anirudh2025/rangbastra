import {
  createCanvaOAuthTransaction,
  sealCanvaOAuthTransaction,
  serializeCanvaOAuthCookie,
} from "./_oauth.js";

const CANVA_AUTHORIZATION_URL =
  "https://www.canva.com/api/oauth/authorize";
const CANVA_REDIRECT_URI =
  "https://rangbastra.luxury/api/canva/callback";

export default function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).send("Method not allowed.");
  }

  const clientId = process.env.CANVA_CLIENT_ID;
  if (!clientId) {
    return response
      .status(500)
      .send("Canva authentication is not configured.");
  }

  try {
    const { codeVerifier, codeChallenge, state } =
      createCanvaOAuthTransaction();
    const sealedTransaction = sealCanvaOAuthTransaction({
      codeVerifier,
      state,
    });
    const authorizationUrl = new URL(CANVA_AUTHORIZATION_URL);

    authorizationUrl.search = new URLSearchParams({
      response_type: "code",
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      state,
      scope: "design:content:read",
      redirect_uri: CANVA_REDIRECT_URI,
      client_id: clientId,
    }).toString();

    response.setHeader(
      "Set-Cookie",
      serializeCanvaOAuthCookie(sealedTransaction),
    );
    response.setHeader("Location", authorizationUrl.toString());
    return response.status(302).end();
  } catch {
    return response
      .status(500)
      .send("Canva authentication is not configured.");
  }
}
