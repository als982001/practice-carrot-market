import { notFound } from "next/navigation";
import { getProduct } from "./actions";
import EditForm from "./EditForm";
import getSession from "@/lib/session";

interface IProps {
  params: {
    id: string;
  };
}

export default async function Edit({ params }: IProps) {
  const id = Number(params.id);

  const product = await getProduct(id);
  const session = await getSession();

  const invalidUser = !session || session.id !== product?.userId;

  if (!product || invalidUser) {
    return notFound();
  }

  return (
    <div className="p-5">
      <div className="ml-5">{`${product.title} 수정`}</div>
      <EditForm product={product} />
    </div>
  );
}
