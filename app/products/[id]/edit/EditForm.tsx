"use client";

import { useFormState } from "react-dom";

import { PhotoIcon } from "@heroicons/react/24/solid";

import { updateProduct } from "../../add/actions";
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
  const { title, price, description, id: productId } = product;

  const [editedProduct, setEditedProduct] = useState<{
    title: string;
    price: number;
    description: string;
  }>({
    title: title,
    price: price,
    description: description,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(product.photo);
  const [state, action] = useFormState(updateProduct, null);

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

    setSelectedFile(file);
    setPreview(url);
  };

  const onInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: "title" | "price" | "description"
  ) => {
    const newValue =
      key === "price" ? Number(event.target.value) : event.target.value;

    setEditedProduct((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
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
        {!selectedFile && (
          <input type="hidden" name="existingPhoto" value={product.photo} />
        )}
        <input type="hidden" name="productId" value={productId} />
        <Input
          required
          placeholder="제목"
          type="text"
          name="title"
          value={editedProduct.title}
          onChange={(event) => onInputChange(event, "title")}
          errors={state?.fieldErrors.title}
        />
        <Input
          required
          placeholder="가격"
          type="number"
          name="price"
          value={editedProduct.price}
          onChange={(event) => onInputChange(event, "price")}
          errors={state?.fieldErrors.price}
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          name="description"
          value={editedProduct.description}
          onChange={(event) => onInputChange(event, "description")}
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
