import { notFound } from "next/navigation";
import { getPost } from "./actions";
import EditForm from "./EditForm";
import getSession from "@/lib/session";

interface IProps {
  params: {
    id: string;
  };
}

export default async function EditPost({ params }: IProps) {
  const id = Number(params.id);

  const post = await getPost(id);
  const session = await getSession();

  const invalidUser = !session || session.id !== post?.userId;

  if (!post || invalidUser) {
    return notFound();
  }

  return (
    <div className="p-5">
      <div className="ml-5">{`${post.title} 수정`}</div>
      <EditForm post={post} />
    </div>
  );
}
