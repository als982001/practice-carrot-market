"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import db from "@/lib/db";
import getSession from "@/lib/session";

const postSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadPost(prevState: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = postSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();

  if (session.id) {
    await db.post.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
    });
  }

  redirect("/life");
}
