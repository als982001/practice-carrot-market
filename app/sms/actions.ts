"use server";

import { redirect } from "next/navigation";

import crypto from "crypto";
import validator from "validator";
import twilio from "twilio";
import { z } from "zod";

import db from "@/lib/db";
import { setUserSession } from "@/utils/authUtils";

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });

  return Boolean(exists);
}

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

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exists");

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

    /*
    // send the token using twlio
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: `Your carrot verification code is: ${token}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: process.env.MY_PHONE_NUMBER!,
    });
    */

    return {
      token: true,
    };
  }

  const result = await tokenSchema.spa(token);

  if (!result.success) {
    return { token: true, error: result.error.flatten() };
  }

  const tokenInfo = await db.sMSToken.findUnique({
    where: {
      token: result.data.toString(),
    },
    select: {
      id: true,
      userId: true,
    },
  });

  await setUserSession(tokenInfo!.userId);
  await db.sMSToken.delete({
    where: {
      id: tokenInfo!.id,
    },
  });

  redirect("/profile");
}
