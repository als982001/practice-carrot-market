"use client";

import { useFormState } from "react-dom";

import { startStream } from "./actions";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);

  return (
    <form className="p-5 flex flex-col gap-2" action={action}>
      <Input
        name="title"
        required
        placeholder="Title or your stream."
        errors={state?.formErrors}
      />
      <Button text="Start streaming" />
    </form>
  );
}
