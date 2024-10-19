import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

import db from "@/lib/db";
import {
  getGithubAccessToken,
  getGithubUserInfo,
  setUserSession,
} from "@/utils/authUtils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return notFound();
  }

  const { accessToken, error } = await getGithubAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatarUrl, username, user } = await getGithubUserInfo(
    accessToken
  );

  if (user) {
    await setUserSession(user.id);
    return redirect("/profile");
  }

  try {
    const newUser = await db.user.create({
      data: {
        username,
        github_id: String(id),
        avatar: avatarUrl,
      },
      select: {
        id: true,
      },
    });

    await setUserSession(newUser.id);
  } catch (error) {
    // PrismaClientKnownRequestError: Prisma에서 발생한 특정 에러
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const targetFields = error.meta?.target as string[]; // ts 타입 에러 관련

      if (targetFields.includes("username")) {
        const newUser = await db.user.create({
          data: {
            username: `${username}_gh`, // 이미 중복되는 username으 있을 경우, username 뒤애 '_gh'를 붙임
            github_id: String(id),
            avatar: avatarUrl,
          },
          select: {
            id: true,
          },
        });

        await setUserSession(newUser.id);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
  } finally {
    return redirect("/profile");
  }
}
