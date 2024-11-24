"use server";

import db from "./db";

export async function getProduct(id: number) {
  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    return product;
  } catch (e) {
    console.error(e);
    return null;
  }
}
