import { CommentsType } from "@/app/posts/[id]/page";
import PostComment from "./PostComment";

interface IProps {
  comments: CommentsType;
}

export default function PostComments({ comments }: IProps) {
  return (
    <div className="mt-8">
      {comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex content-start min-h-10 gap-2 border-b border-neutral-500 last:border-b-0"
            >
              <PostComment comment={comment} />
            </div>
          ))}
        </>
      ) : (
        <div>작성된 댓글이 없습니다.</div>
      )}
    </div>
  );
}
