import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function proxy(req: NextRequest, method: string, params: string[]) {
  const targetUrl = `${BASE_URL}/${params.join("/")}${req.nextUrl.search}`;
  const body = method === "GET" ? undefined : await req.text();

  const newHeaders = new Headers(req.headers);

  newHeaders.delete("accept-encoding"); // 디코딩 중복 방지

  const token = (await cookies()).get("accessToken")?.value;
  if (token) {
    newHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(targetUrl, {
    method,
    headers: newHeaders,
    body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(req: NextRequest, context: any) {
  const { path } = await context.params;
  return proxy(req, "GET", path);
}

export async function POST(req: NextRequest, context: any) {
  const { path } = await context.params;
  return proxy(req, "POST", path);
}

export async function PUT(req: NextRequest, context: any) {
  const { path } = await context.params;
  return proxy(req, "PUT", path);
}

export async function DELETE(req: NextRequest, context: any) {
  const { path } = await context.params;
  return proxy(req, "DELETE", path);
}
