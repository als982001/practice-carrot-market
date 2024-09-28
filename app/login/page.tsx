import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import SocialLogin from "@/components/SocialLogin";

export default function Login() {
  async function handleForm(formData: FormData) {
    "use server";
    console.log(formData);
    console.log("!!!");
  }

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form action={handleForm} className="flex flex-col gap-3">
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
          errors={[]}
        />
        <FormButton text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
