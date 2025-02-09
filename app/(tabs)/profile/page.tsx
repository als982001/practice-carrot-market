import db from "@/lib/db";
import getSession from "@/lib/session";
import { destroyUserSession } from "@/utils/authUtils";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getUserPosts, getUserProducts } from "./actions";
import Product from "@/components/Product";
import UserProducts from "./UserProducts";
import UserPosts from "./UserPosts";

async function getUser() {
  const session = await getSession();

  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (user) {
      return user;
    }
  }

  notFound();
}

async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = await getUser();

  return <h1>Welcome! {user.username}</h1>;
}

export default async function Profile() {
  const user = await getUser();
  const products = await getUserProducts(user.id);
  const posts = await getUserPosts(user.id);

  const logOut = async () => {
    "use server";

    await destroyUserSession();

    redirect("/");
  };

  console.log("products", products);
  console.log("posts", posts);

  return (
    <div>
      <Suspense fallback={"Welcome!"}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button>Log out</button>
      </form>
      <div>
        <div>올린 상품들</div>
        <UserProducts products={products} />
      </div>
      <div>
        <div>작성한 게시물들</div>
        <UserPosts posts={posts} />
      </div>
    </div>
  );
}
