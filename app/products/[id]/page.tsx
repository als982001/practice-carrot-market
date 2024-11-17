import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import { unstable_cache as nextCache, revalidateTag } from "next/cache";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";

/*
const funcForCommit = async () => {
  fetch("https://api.com", {
    next: {
      revalidate: 60,
      tags: ["tagForCommit"],
    },
  });
};
*/

async function getIsOwner(userId: number) {
  // getSession은 쿠키를 이용 -> 쿠키 이용할 경우 dynamic routing

  const session = await getSession();

  if (session.id) {
    return session.id === userId;
  }

  return false;
}

async function getProduct(id: number) {
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
}

const getProductTitle = async (id: number) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: { title: true },
  });

  return product;
};

/*
const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});
*/

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductTitle(Number(params.id));

  return { title: product?.title ?? "" };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const useCloudFlare = false;
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  /*   const revalidate = async () => {
    "use server";

    revalidateTag("product-detail");
  }; */

  return (
    <div className="pb-40">
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={product.photo}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center justify-between border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="size-10 overflow-hidden rounded-full">
            {product.user.avatar !== null ? (
              <Image
                src={product.user.avatar}
                width={40}
                height={40}
                alt={product.user.username}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div>
            <h3>{product.user.username}</h3>
          </div>
        </div>
        <div>
          <Link className="text-white" href={`/products/${id}/edit`}>
            수정
          </Link>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0  p-5 pb-10 bg-neutral-800 flex justify-between items-center max-w-screen-sm">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
            Delete product
          </button>
        ) : null}
        {/*  {isOwner ? (
          <form action={revalidate}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Revalidate title cache
            </button>
          </form>
        ) : null} */}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}

/*
export const dynamicParams = true; // true가 기본값

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });

  return products.map((product) => ({ id: String(product.id) }));
}
*/
