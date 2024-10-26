"use server";

import { redirect } from "next/navigation";

import { z } from "zod";

import db from "@/lib/db";
import getSession from "@/lib/session";
import fs from "fs/promises";

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

    redirect(`/products/${product.id}`);
  }
}
