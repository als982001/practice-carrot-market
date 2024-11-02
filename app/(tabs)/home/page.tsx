import Link from "next/link";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

import ProductList from "@/components/ProductList";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
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

const getCacheProducts = nextCache(getInitialProducts, ["home-products"]);

export const metadata = {
  title: "Home",
};

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getCacheProducts();

  const revalidate = async () => {
    "use server";

    revalidatePath("/home");
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <p>Product!</p>
      <div>
        <ProductList initialProducts={initialProducts} />
        <Link
          href="/products/add"
          className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
        >
          <PlusIcon className="size-10" />
        </Link>
      </div>
    </div>
  );
}
