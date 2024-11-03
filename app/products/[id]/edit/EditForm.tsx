"use client";

import { useFormState } from "react-dom";

import { PhotoIcon } from "@heroicons/react/24/solid";

import { uploadProduct } from "../../add/actions";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { checkValidImage } from "@/lib/utils";

interface IProps {
  product: {
    user: {
      username: string;
      avatar: string | null;
    };
  } & {
    id: number;
    title: string;
    price: number;
    photo: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    userId: number;
  };
}

export default function EditForm({ product }: IProps) {
  const [preview, setPreview] = useState("");
  const [state, action] = useFormState(uploadProduct, null);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) {
      return;
    }

    const file = files[0];

    const validImage = checkValidImage(file);

    if (!validImage) {
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${product.photo})`,
          }}
        >
          {preview === "" && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          )}
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
        <Input
          required
          placeholder="제목"
          type="text"
          name="title"
          errors={state?.fieldErrors.title}
        />
        <Input
          required
          placeholder="가격"
          type="number"
          name="price"
          errors={state?.fieldErrors.price}
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          name="description"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
