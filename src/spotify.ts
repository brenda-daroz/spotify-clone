import axios from "axios";

const generateRandomString = (length: number): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values).reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = "http://localhost:8000/";

const scope = "user-read-private user-read-email";

export const generateLoginUrl = async () => {
  const codeVerifier = generateRandomString(64);
  localStorage.setItem("code_verifier", codeVerifier);
  console.log("Stored code verifier:", codeVerifier);

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  const authUrl = new URL("https://accounts.spotify.com/authorize");

  authUrl.search = new URLSearchParams(params).toString();
  return authUrl.toString();
};

export const getToken = async (code: string): Promise<void> => {
  const codeVerifier = localStorage.getItem("code_verifier");
  console.log("Stored code verifier:", codeVerifier);

  if (!codeVerifier) {
    throw new Error("Code verifier not found in local storage");
  }

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  const response = await fetch(url, payload);
  const data = await response.json();

  console.log("data", data);

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    console.log("access token", data.access_token);
  } else {
    throw new Error("Failed to get access token");
  }
};

export const getUserDetails = async (accessToken: string): Promise<unknown> => {
  if (accessToken) {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user details", error);
      throw error;
    }
  }
};
