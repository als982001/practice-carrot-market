import db from "@/lib/db";
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

export const getGithubAccessToken = async (code: string) => {
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

  return { error, accessToken };
};

export const getGithubUserInfo = async (accessToken: string) => {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });

  const {
    id,
    avatar_url: avatarUrl,
    login: username,
  } = await userProfileResponse.json();

  const user = await db.user.findUnique({
    where: {
      github_id: String(id),
    },
    select: {
      id: true,
    },
  });

  return { id, avatarUrl, username, user };
};
