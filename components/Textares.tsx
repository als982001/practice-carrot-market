import { TextareaHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Textarea({
  name,
  errors = [],
  ...rest
}: InputProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        name={name}
        {...rest}
      />
      {errors.map((error) => (
        <span key={error} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
