import db from "@/lib/db";

export async function getUserProducts(userId: number) {
  try {
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
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserPosts(userId: number) {
  try {
    const posts = await db.post.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        views: true,
        created_at: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error(error);
    return [];
  }
}
