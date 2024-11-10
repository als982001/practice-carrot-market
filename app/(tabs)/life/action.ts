"use server";

import { redirect } from "next/navigation";

import { z } from "zod";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

const checkNoComment = (comment: string) => {
  return comment.length > 0;
};

const checkCommentLength = (comment: string) => {
  return comment.length < 255;
};

const commentFormSchema = z
  .string()
  .trim()
  .refine(checkNoComment, "댓글을 입력하세요.")
  .refine(checkCommentLength, "너무 깁니다.");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handlePostComment(
  prevState: any,
  formData: FormData,
  postId: number
) {
  const comment = formData.get("comment");

  const {
    data: resultData,
    error,
    success,
  } = await commentFormSchema.spa(comment);

  if (!success) {
    return error.flatten();
  }

  const session = await getSession();

  if (!session.id) {
    redirect("/life");
  }

  const newComment = await db.comment.create({
    data: {
      payload: resultData!,
      user: {
        connect: { id: session.id },
      },
      post: {
        connect: { id: postId },
      },
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  revalidateTag("post-comments");

  return error;
}
