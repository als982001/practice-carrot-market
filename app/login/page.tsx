"use client";

import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import SocialLogin from "@/components/SocialLogin";
import { useFormState } from "react-dom";
import { handleForm } from "./action";

export default function Login() {
  // useFormState는 결과를 알고 싶은 action을 인자로 넘겨줘야 함
  const [state, action] = useFormState(handleForm, null);

  console.log({ state, action });

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors ?? []}
        />
        <FormButton text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
