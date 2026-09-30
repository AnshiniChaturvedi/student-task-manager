import { NextResponse } from "next/server";

export function errorResponse(message: string, status: number, details?: string[]) {
  return NextResponse.json(details ? { error: message, details } : { error: message }, { status });
}

// Turns common MongoDB / configuration errors into a plain-English hint for the terminal.
function hintFor(err: unknown): string | undefined {
  const e = err as { name?: string; message?: string; code?: unknown; syscall?: string };
  const text = `${e?.name ?? ""} ${e?.message ?? ""}`;

  if (text.includes("MONGODB_URI is not defined")) {
    return "MONGODB_URI is missing. Check that .env.local is in the project root (next to package.json), the variable name is exactly MONGODB_URI, and restart `npm run dev`.";
  }
  if (/MongoParseError|Invalid scheme|Invalid connection string|unescaped|Invalid URL/i.test(text)) {
    return "MONGODB_URI is malformed. Remove the < > around the password, and URL-encode special characters in the password (e.g. @ becomes %40).";
  }
  if (/bad auth|authentication failed|AuthenticationFailed/i.test(text) || e?.code === 18 || e?.code === 8000) {
    return "Atlas rejected the username/password. Check the Database Access user and password in MONGODB_URI.";
  }
  if (e?.syscall === "querySrv" || /querySrv/i.test(text)) {
    return "DNS lookup of the mongodb+srv:// address failed. Check the cluster hostname in MONGODB_URI, your internet/DNS (try another network or DNS 8.8.8.8), or use Atlas's non-SRV connection string (mongodb://...).";
  }
  if (/ServerSelection|ReplicaSetNoPrimary|timed out|ECONNREFUSED|ETIMEDOUT/i.test(text)) {
    return "Could not reach the Atlas cluster. Add your current IP under Atlas > Network Access (or 0.0.0.0/0 for testing), check your network/firewall, and make sure the cluster is not paused.";
  }
  if (/ssl|tls|certificate/i.test(text)) {
    return "TLS/SSL error while connecting. Check your network/antivirus/proxy, and that your Node.js version is 20.19 or newer.";
  }
  return undefined;
}

// Logs the real error on the server and returns a generic 500 to the client.
export function serverError(context: string, err: unknown) {
  const e = err as { name?: string; message?: string; code?: unknown };
  console.error(`[api/tasks] ${context} failed`);
  console.error(`  name:    ${e?.name ?? "unknown"}`);
  console.error(`  code:    ${e?.code ?? "n/a"}`);
  console.error(`  message: ${e?.message ?? String(err)}`);
  const hint = hintFor(err);
  if (hint) console.error(`  hint:    ${hint}`);
  console.error(err); // full error with stack trace
  return errorResponse("Something went wrong on the server. Please try again.", 500);
}

// Reads the JSON body; returns undefined when it is missing or malformed.
export async function readJson(request: Request): Promise<unknown | undefined> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}
