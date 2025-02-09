"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { PhotoIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUploadUrl, uploadProduct, uploadProductRHF } from "./actions";
import { productSchema, ProductType } from "./schema";

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
  const useCloudFlare = false;
  const useRHF = false;

  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState(""); // CloudFlare 관련 state
  const [file, setFile] = useState<File | null>(null); // RHF 관련 state

  const {
    register,
    handleSubmit,
    setValue,
    // setError,
    formState: { errors },
  } = useForm<ProductType>({ resolver: zodResolver(productSchema) });

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
    setFile(file);

    if (!useCloudFlare) {
      return;
    }

    const { success, result } = await getUploadUrl();

    if (success) {
      const { id, uploadUrl } = result;
      setUploadUrl(uploadUrl);
      setImageId(id); // cloudflare 관련 로직
      setValue("photo", `${process.env.CLOUDFLARE_PHOTO_URL}/${id}`); // RHF 관련 로직
    }
  };

  // CloudFlare 관련 함수
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");

    if (!file) {
      return;
    }

    const cloudflareForm = new FormData();

    cloudflareForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      return;
    }

    const photoUrl = `${process.env.CLOUDFLARE_PHOTO_URL}/${imageId}`;

    formData.set("photo", photoUrl);

    return uploadProduct(_, formData);
  };

  // CloudFlare + RHF 관련 함수
  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) {
      return;
    }

    const cloudflareForm = new FormData();

    cloudflareForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      return;
    }

    const formData = new FormData();

    const { title, price, description, photo } = data;

    formData.append("title", title);
    formData.append("price", String(price));
    formData.append("description", description);
    formData.append("photo", photo);

    const errors = await uploadProductRHF(formData);

    if (errors) {
      // setError()
    }
  });

  // RHF 관련 함수
  const onValid = async () => {
    await onSubmit();
  };

  const [state, action] = useFormState(
    useCloudFlare ? interceptAction : uploadProduct,
    null
  );

  return (
    <div className="p-5">
      <div className="ml-5">상품 등록</div>
      <form
        action={useCloudFlare && useRHF ? onValid : action}
        className="p-5 flex flex-col gap-5"
      >
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
                {useCloudFlare && useRHF
                  ? errors.photo?.message
                  : state?.fieldErrors.photo}
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
          {...(useCloudFlare && useRHF
            ? { ...register("title") }
            : { name: "title" })}
          errors={
            useCloudFlare && useRHF
              ? [errors.title?.message ?? ""]
              : state?.fieldErrors.title
          }
        />
        <Input
          required
          placeholder="가격"
          type="number"
          {...(useCloudFlare && useRHF
            ? { ...register("price") }
            : { name: "price" })}
          errors={
            useCloudFlare && useRHF
              ? [errors.price?.message ?? ""]
              : state?.fieldErrors.price
          }
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          {...(useCloudFlare && useRHF
            ? { ...register("description") }
            : { name: "description" })}
          errors={
            useCloudFlare && useRHF
              ? [errors.description?.message ?? ""]
              : state?.fieldErrors.description
          }
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
