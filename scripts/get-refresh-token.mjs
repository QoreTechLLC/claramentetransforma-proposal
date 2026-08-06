// One-time helper: run `npm run get-refresh-token` locally (never on a
// server) to authorize this app against the coach's Google account and
// print a GOOGLE_REFRESH_TOKEN to paste into .env.local / Vercel.
//
// Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to already be set
// as environment variables, or in a local .env.local file loaded below.

import { google } from "googleapis";
import readline from "node:readline/promises";
import { config } from "node:process";
import fs from "node:fs";
import open from "open";

// Load .env.local manually so this script has no extra dependency.
if (fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
  }
}

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error(
    "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (in .env.local) before running this script."
  );
  process.exit(1);
}

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar"],
});

console.log("\nOpening the Google sign-in page in your browser...");
console.log(
  "IMPORTANT: sign in with the COACH's Google account (the one that will own the calendar), not your own.\n"
);
console.log(`If it doesn't open automatically, visit:\n${authUrl}\n`);
await open(authUrl);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const code = await rl.question(
  "After approving access, paste the ?code= value shown on the redirect page here: "
);
rl.close();

const { tokens } = await oAuth2Client.getToken(code.trim());

console.log("\nSuccess! Add this to your .env.local and to Vercel's environment variables:\n");
console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
