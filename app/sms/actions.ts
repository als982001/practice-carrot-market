"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import validator from "validator";
import { z } from "zod";

import db from "@/lib/db";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );
const tokenSchema = z.coerce.number().min(100000).max(999999);

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();

  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: { id: true },
  });

  if (exists) {
    return getToken();
  }

  return token;
}

interface ActionState {
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);

    const { success, data: phoneNumber } = result;

    if (!success) {
      return { token: false, error: result.error.flatten() };
    }

    await db.sMSToken.deleteMany({
      where: {
        user: {
          phone: phoneNumber,
        },
      },
    });

    const token = await getToken();

    await db.sMSToken.create({
      data: {
        token,
        user: {
          connectOrCreate: {
            where: {
              phone: phoneNumber,
            },
            create: {
              username: crypto.randomBytes(10).toString("hex"),
              phone: phoneNumber,
            },
          },
        },
      },
    });

    // send the token using twlio

    return {
      token: true,
    };
  }

  const result = tokenSchema.safeParse(token);

  if (!result.success) {
    return { token: true, error: result.error.flatten() };
  }

  redirect("/");
}
