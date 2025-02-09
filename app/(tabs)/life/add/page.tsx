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
    <div>
      <form className="p-5 flex flex-col gap-5" action={action}>
        <Input type="text" placeholder="제목" name="title" required />
        <textarea
          placeholder="내용"
          name="description"
          required
          style={{ color: "black" }}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
