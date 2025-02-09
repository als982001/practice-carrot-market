"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";
import { useFormState } from "react-dom";
import Textarea from "@/components/Textares";
import { updatePost } from "./actions";

interface IProps {
  post: {
    created_at: Date;
    description: string | null;
    id: number;
    title: string;
    updated_at: Date;
    userId: number;
    views: number;
  };
}

export default function EditForm({ post }: IProps) {
  const { title, description } = post;
  const [editedPost, setEditedPost] = useState<{
    title: string;
    description: string;
  }>({
    title,
    description: description ?? "",
  });
  const [state, action] = useFormState(updatePost, null);

  const onInputChange = (value: string, key: "title" | "description") => {
    setEditedPost((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form className="p-5 flex flex-col gap-5" action={action}>
      <input type="hidden" name="postId" value={post.id} readOnly />
      <Input
        type="text"
        placeholder="제목"
        name="title"
        required
        value={editedPost.title}
        onChange={(event) => onInputChange(event.target.value, "title")}
        errors={state?.fieldErrors.description}
      />
      <Textarea
        placeholder="내용"
        name="description"
        required
        value={editedPost.description}
        onChange={(event) => onInputChange(event.target.value, "description")}
        className="bg-transparent rounded-md w-full focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        style={{ height: "300px" }}
        errors={state?.fieldErrors.description}
      />
      <Button text="수정 완료" />
    </form>
  );
}
