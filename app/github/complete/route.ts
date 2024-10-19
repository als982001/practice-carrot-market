import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

import db from "@/lib/db";
import { setUserSession } from "@/utils/authUtils";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  console.log({ nextUrl: request.nextUrl, code });

  if (!code) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const { error, access_token: accessToken } = await accessTokenResponse.json();

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });

  const { id, avatar_url: avatarUrl, login } = await userProfileResponse.json();

  const user = await db.user.findUnique({
    where: {
      github_id: String(id),
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await setUserSession(user.id);

    return redirect("/profile");
  }

  const newUser = await db.user.create({
    data: {
      username: `${login}-gh`,
      github_id: String(id),
      avatar: avatarUrl,
    },
    select: {
      id: true,
    },
  });

  await setUserSession(newUser.id);

  return redirect("/profile");
}
