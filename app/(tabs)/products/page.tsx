import ProductList from "@/components/ProductList";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getInitialProducts();

  return (
    <div className="p-5 flex flex-col gap-5">
      <p>Product!</p>
      <div>
        <ProductList initialProducts={initialProducts} />
      </div>
    </div>
  );
}
