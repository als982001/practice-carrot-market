"use client";

import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { uploadPost } from "./actions";
import Button from "@/components/Button";
import Textarea from "@/components/Textares";

export default function AddPost() {
  const [state, action] = useFormState(uploadPost, null);

  return (
    <div className="p-5">
      <div className="ml-5">게시물 작성</div>
      <form className="p-5 flex flex-col gap-5" action={action}>
        <Input
          type="text"
          placeholder="제목"
          name="title"
          required
          errors={state?.fieldErrors.title}
        />
        <Textarea
          placeholder="내용"
          name="description"
          required
          className="bg-transparent rounded-md w-full focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
          style={{ height: "300px" }}
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
