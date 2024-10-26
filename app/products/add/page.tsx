"use client";

import { useState } from "react";

import { PhotoIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { uploadProduct } from "./actions";

const IMAGE_SIZE_LIMIT = 5_242_880;

const checkValidImage = (file: File) => {
  const { size, type } = file;

  if (!type.startsWith("image/")) {
    alert("이미지가 아님");
    return false;
  }

  if (size > IMAGE_SIZE_LIMIT) {
    alert("이미지가 5MB보다 크네요");
    return false;
  }

  return true;
};

export default function AddProduct() {
  const [preview, setPreview] = useState("");

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    if (url.length === 0) {
      setPreview(url);
    }
  };

  return (
    <div>
      <form action={uploadProduct} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
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
        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="number" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
