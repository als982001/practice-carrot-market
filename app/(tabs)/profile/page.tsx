import db from "@/lib/db";
import getSession from "@/lib/session";
import { destroyUserSession } from "@/utils/authUtils";
import { notFound, redirect } from "next/navigation";

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
      <h1>Welcome! {user.username}</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}
