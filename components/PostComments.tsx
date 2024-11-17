// import { unstable_cache as nextCache } from "next/cache";

import db from "@/lib/db";

import PostComment from "./PostComment";
import CommentForm from "./CommentForm";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";

async function getComments(postId: number) {
  try {
    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
      /* select: {
        id: true,
        payload: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      }, */
    });

    return comments;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export type CommentsType = Prisma.PromiseReturnType<typeof getComments>;

interface IProps {
  postId: number;
}

export default async function PostComments({ postId }: IProps) {
  const comments = await getComments(postId);

  return (
    <>
      <div className="mt-8">
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex content-start min-h-10 gap-2 border-b border-neutral-500 last:border-b-0"
              >
                <PostComment comment={comment} postId={postId} />
              </div>
            ))}
          </>
        ) : (
          <div>작성된 댓글이 없습니다.</div>
        )}
      </div>
      <CommentForm postId={postId} />
    </>
  );
}
