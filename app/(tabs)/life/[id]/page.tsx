import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import LikeButton from "@/components/LikeButton";
import { PencilIcon } from "@heroicons/react/24/solid";

import PostComments from "@/components/PostComments";

async function getPost(id: number) {
  console.log("getPost");

  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    console.log(`views: ${post.views}`);
    return post;
  } catch (e) {
    console.error(e);
    return null;
  }
}

const getLikeCount = async (postId: number) => {
  try {
    const likeCount = await db.like.count({
      where: {
        postId,
      },
    });

    return likeCount;
  } catch (e) {
    console.error(e);

    return 0;
  }
};

/*
async function getLikeStatus(postId: number) {
  const session = await getSession();

  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}


// 몬가 문제가 있음
function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });

  return cachedOperation(postId);
}
*/

async function getIsLiked(postId: number) {
  const session = await getSession();

  const like = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });

  return Boolean(like);
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

const getCachedLikeCount = nextCache(getLikeCount, ["post-detail-like-count"], {
  tags: ["post-detail-like-count"],
  revalidate: 60,
});

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);
  const session = await getSession();

  if (!post) {
    return notFound();
  }

  const isLiked = await getIsLiked(id);
  const likeCount = await getCachedLikeCount(id);
  const isOwner = post.userId === session.id;

  const deletePost = async () => {
    "use server";

    const session = await getSession();

    try {
      await db.post.delete({
        where: { id: post.id },
      });
    } catch (error) {
      console.error(error);
    } finally {
      redirect("/life");
    }
  };

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <div className="flex gap-5">
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
          {isOwner && (
            <>
              <Link
                className={
                  "flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors hover:bg-neutral-800"
                }
                href={`/life/${id}/edit`}
              >
                <PencilIcon className="size-5" />
                수정
              </Link>
              <form action={deletePost}>
                <button
                  className={
                    "flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors hover:bg-neutral-800"
                  }
                >
                  <PencilIcon className="size-5" />
                  삭제
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <PostComments postId={id} />
    </div>
  );
}
