import getSession from "@/lib/session";

export async function setUserSession(userId: number) {
  const session = await getSession();
  session.id = userId;

  await session.save();
}

export async function destroyUserSession() {
  const session = await getSession();
  await session.destroy();
}
