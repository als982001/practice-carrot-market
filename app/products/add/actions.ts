"use server";

import { redirect } from "next/navigation";

import { z } from "zod";

import db from "@/lib/db";
import getSession from "@/lib/session";
import fs from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";

const productSchema = z.object({
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadProduct(prevState: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();

    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();

  if (session.id) {
    const product = await db.product.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    revalidateTag("initial-products");
    revalidatePath("/home");

    redirect(`/products/${product.id}`);
  }
}

// react-hook-form을 이용하는 경우
export const uploadProductRHF = async (formData: FormData) => {
  {
    const data = {
      photo: formData.get("photo"),
      title: formData.get("title"),
      price: formData.get("price"),
      description: formData.get("description"),
    };

    if (data.photo instanceof File) {
      const photoData = await data.photo.arrayBuffer();

      await fs.appendFile(
        `./public/${data.photo.name}`,
        Buffer.from(photoData)
      );
      data.photo = `/${data.photo.name}`;
    }

    const result = productSchema.safeParse(data);

    if (!result.success) {
      return result.error.flatten();
    }

    const session = await getSession();

    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      redirect(`/products/${product.id}`);
    }
  }
};

// cloudflare를 이용하는 경우
export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );

  const data = await response.json();

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProduct(prevState: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    existingPhoto: formData.get("existingPhoto"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const productId = Number(formData.get("productId"));

  const dataPhotoName = data.photo instanceof File ? data.photo.name : "";

  const isUsingExistingPhoto = dataPhotoName === "undefined";

  if (isUsingExistingPhoto) {
    data.photo = data.existingPhoto;
  } else if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();

    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();

  if (session.id) {
    const product = await db.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    revalidateTag("initial-products");
    revalidatePath("/home");

    redirect(`/products/${product.id}`);
  }
}
