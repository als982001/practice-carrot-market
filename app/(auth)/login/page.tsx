"use client";

import Input from "@/components/Input";
import Button from "@/components/Button";
import SocialLogin from "@/components/SocialLogin";
import { useFormState } from "react-dom";
import { login } from "./action";

export default function Login() {
  // useFormState는 결과를 알고 싶은 action을 인자로 넘겨줘야 함
  // action의 결과, action의 트리거(dispatch)를 돌려줌
  const [state, dispatch] = useFormState(login, null);

  console.log({ state, dispatch });

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
        />
        <Button text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
