"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import { redirect } from "next/navigation";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { setUserSession } from "@/utils/authUtils";

/*
const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    // select: user에서 가져오고 싶은 것들 선택
    select: {
      id: true, // user에서 id만 가져옴 (email 등은 안 가져옴)
    },
  });

  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};
*/

const formSchema = z
  .object({
    username: z
      .string({
        // invalid_type_error: 타입이 맞지 않을 때
        // required_error: 필수값이 없을 때
        invalid_type_error: "Username must be a string!",
        required_error: "No username",
      })
      .min(5, "Way too short")
      .max(10, "That is too long")
      .trim()
      .toLowerCase(),
    // .transform((username) => `🔥 ${username}`)
    // .refine(checkUniqueUsername, "This username is already taken")
    // .refine(checkUsername, "No potato allowed"),
    email: z.string().email().toLowerCase(),
    /* .refine(
        checkUniqueEmail,
        "There is an account already registered with that email"
      ),*/
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"], // path가 없으면 이 에러 메시지는 formErrors로 들어감
        fatal: true,
      });

      return z.NEVER; // z.NEVER를 return하는데 fatal이 true라면 이후의 refine을 실행하지 않고 끝냄
    }
  })
  .superRefine(async ({ email }, context) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      context.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });

      return z.NEVER;
    }
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      // ctx로 특정 필드에 에러 메시지 추가
      ctx.addIssue({
        code: "custom",
        message: "Two passwords should be equal",
        path: ["confirmPassword"],
      });
    }
  });
/* .refine(checkPasswords, {
     message: "Two passwords should be equal",
        path: ["confirmPassword"],
  }); */

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // formSchema.parse(data.username);

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const {
      data: { username, email, password },
    } = result;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    await setUserSession(user.id);

    redirect("/profile");
  }
}
