import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidateTag("initial-products");

  return NextResponse.json({ revalidated: true });
}
