"use server";

import { z } from "zod";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";

const checkUsername = (username: string) => !username.includes("potato");

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
      .toLowerCase()
      .transform((username) => `🔥 ${username}`)
      .refine(checkUsername, "No potato allowed"),
    email: z.string().email(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
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
  console.log(formData);

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // formSchema.parse(data.username);

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result);
  }
}
