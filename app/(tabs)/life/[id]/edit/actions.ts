"use server";

import { revalidateTag } from "next/cache";
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

export async function getPost(id: number) {
  const post = await db.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return post;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePost(prevState: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const postId = Number(formData.get("postId"));

  const result = postSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();

  if (session.id) {
    await db.post.update({
      where: {
        id: Number(postId),
      },
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

  revalidateTag("post-detail");
  redirect(`/life/${postId}`);
}
