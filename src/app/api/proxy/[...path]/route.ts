import { NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function proxy(req: NextRequest, method: string, params: { path: string[] }) {
  const url = `${BASE_URL}/${params.path.join("/")}${req.nextUrl.search}`;
  const body = method === "GET" ? undefined : await req.text();

  const res = await fetch(url, {
    method,
    headers: req.headers,
    body,
  });

  return res;
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, "GET", ctx.params);
}
export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, "POST", ctx.params);
}
export async function PUT(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, "PUT", ctx.params);
}
export async function DELETE(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, "DELETE", ctx.params);
}
