import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function proxy(req: NextRequest, method: string, params: string[]) {
  const targetUrl = `${BASE_URL}/${params.join("/")}${req.nextUrl.search}`;
  const body = method === "GET" ? undefined : await req.text();

  const newHeaders = new Headers(req.headers);

  newHeaders.delete("accept-encoding");

  const token = (await cookies()).get("accessToken")?.value;
  if (token) {
    newHeaders.set("Authorization", `Bearer ${token}`);
  }

  return fetch(targetUrl, {
    method,
    headers: newHeaders,
    body,
  });
}

export async function GET(req: NextRequest, context: any) {
  return proxy(req, "GET", context.params.path);
}
export async function POST(req: NextRequest, context: any) {
  return proxy(req, "POST", context.params.path);
}
export async function PUT(req: NextRequest, context: any) {
  return proxy(req, "PUT", context.params.path);
}
export async function DELETE(req: NextRequest, context: any) {
  return proxy(req, "DELETE", context.params.path);
}
