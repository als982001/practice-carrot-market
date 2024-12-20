"use server";

import { revalidateTag } from "next/cache";

import db from "@/lib/db";
import getSession from "@/lib/session";

export const likePost = async (postId: number) => {
  const session = await getSession();

  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });

    revalidateTag(`like-status-${postId}`);
    revalidateTag("post-detail-like-count");
  } catch (e) {
    console.error(e);
  }
};

export const dislikePost = async (postId: number) => {
  const session = await getSession();

  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });

    revalidateTag(`like-status-${postId}`);
    revalidateTag("post-detail-like-count");
  } catch (e) {
    console.error(e);
  }
};
