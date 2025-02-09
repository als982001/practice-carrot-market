"use client";

import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { uploadPost } from "./actions";
import { useEffect } from "react";
import Button from "@/components/Button";

export default function AddPost() {
  const [state, action] = useFormState(uploadPost, null);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div className="p-5">
      <div className="ml-5">게시물 작성</div>
      <form className="p-5 flex flex-col gap-5" action={action}>
        <Input type="text" placeholder="제목" name="title" required />
        <textarea
          placeholder="내용"
          name="description"
          required
          className="bg-transparent rounded-md w-full focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
          style={{ height: "300px" }}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
