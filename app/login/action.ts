"use server";

export async function handleForm(prevState: any, formData: FormData) {
  console.log({ prevState, formData });

  return { errors: ["wrong password", "password too short"] };
}
