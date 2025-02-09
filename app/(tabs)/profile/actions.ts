import db from "@/lib/db";

export async function getUserProducts(userId: number) {
  const products = await db.product.findMany({
    where: {
      userId: userId,
    },
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}
