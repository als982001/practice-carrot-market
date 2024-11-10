"use client";

import { handlePostComment } from "@/app/(tabs)/life/action";
import { useFormState } from "react-dom";

interface IProps {
  postId: number;
}

export default function CommentForm({ postId }: IProps) {
  const [state, dispatch] = useFormState(
    (prevState: any, formData: FormData) =>
      handlePostComment(prevState, formData, postId),
    null
  );

  return (
    <form className="mt-8" action={dispatch}>
      <div className="flex items-end gap-2 mb-2">
        <input
          placeholder="댓글을 작성하세요."
          name="comment"
          type="text"
          // required
          style={{
            color: "black",
            width: "calc(100% - 108px)",
            borderRadius: "4px",
          }}
        />
        <button
          style={{
            width: "100px",
            height: "30px",
            borderRadius: "4px",
          }}
          className="bg-orange-500 text-white border-orange-500"
        >
          작성
        </button>
      </div>
      {state?.formErrors?.map((error) => (
        <span key={error} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </form>
  );
}
