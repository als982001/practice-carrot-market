"use server";

import db from "./db";

export async function getProduct(id: number) {
  try {
    if (typeof id !== "number") {
      throw new Error("적합하지 않은 id입니다.");
    }

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
