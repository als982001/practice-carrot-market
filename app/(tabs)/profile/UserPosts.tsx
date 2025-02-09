"use client";

import Post from "@/components/Post";
import { useState } from "react";

interface IProps {
  posts: {
    id: number;
    title: string;
    description: string | null;
    views: number;
    created_at: Date;
    _count: {
      comments: number;
      likes: number;
    };
  }[];
}

export default function UserPosts({ posts }: IProps) {
  const [showPosts, setShowPosts] = useState(false);

  const handleShoeProducts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setShowPosts((prev) => !prev);
  };

  if (posts.length === 0) {
    return <div>등록한 게시물이 없습니다.</div>;
  }

  return (
    <div>
      <button onClick={handleShoeProducts}>
        {showPosts ? "접기" : "펼치기"}
      </button>
      {showPosts && (
        <div>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
