import { redirect } from "next/navigation";
import { z } from "zod";

import db from "@/lib/db";
import getSession from "@/lib/session";

const title = z.string();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function startStream(_: any, formData: FormData) {
  const results = title.safeParse(formData.get("title"));

  if (!results.success) {
    return results.error.flatten();
  }

  const session = await getSession();

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDFLARE_API_KEY}`,
      },
      body: JSON.stringify({
        meta: {
          name: results.data,
        },
        recording: {
          mode: "automatic",
        },
      }),
    }
  );
  const data = await response.json();

  const stream = await db.liveStream.create({
    data: {
      title: results.data,
      stream_id: data.result.uid,
      stream_key: data.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });

  redirect(`/streams/${stream.id}`);
}
