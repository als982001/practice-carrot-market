import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("GET!!!", request);

  return Response.json({ ok: true });
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  console.log("POST!!!", data);

  return Response.json(data);
}
