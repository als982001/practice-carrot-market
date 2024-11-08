import db from "@/lib/db";
import getSession from "@/lib/session";
import { destroyUserSession } from "@/utils/authUtils";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

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

  console.log(user);

  const logOut = async () => {
    "use server";

    await destroyUserSession();

    redirect("/");
  };

  return (
    <div>
      <Suspense fallback={"Welcome!"}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}
