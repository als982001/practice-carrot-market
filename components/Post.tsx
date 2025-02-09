import Link from "next/link";

import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

interface IProps {
  post: {
    id: number;
    title: string;
    description: string | null;
    views: number;
    created_at: Date;
    _count: {
      comments: number;
      likes: number;
    };
  };
}

export default function Post({ post }: IProps) {
  return (
    <Link
      key={post.id}
      href={`/life/${post.id}`}
      className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
    >
      <h2 className="text-white text-lg font-semibold">{post.title}</h2>
      <p>{post.description}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>·</span>
          <span>조회 {post.views}</span>
        </div>
        <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
          <span>
            <HandThumbUpIcon className="size-4" />
            {post._count.likes}
          </span>
          <span>
            <ChatBubbleBottomCenterIcon className="size-4" />
            {post._count.likes}
          </span>
        </div>
      </div>
    </Link>
  );
}
