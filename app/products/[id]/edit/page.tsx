import { notFound } from "next/navigation";
import { getProduct } from "./actions";
import EditForm from "./EditForm";

interface IProps {
  params: {
    id: string;
  };
}

export default async function Edit({ params }: IProps) {
  const id = Number(params.id);

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <div>{product.title}</div>
      <EditForm product={product} />
    </div>
  );
}
