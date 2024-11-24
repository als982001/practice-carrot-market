import { useEffect, useState } from "react";

import { PhotoIcon } from "@heroicons/react/24/solid";
import db from "@/lib/db";

interface IProps {
  id: number;
  handleShoWModal: (e: React.MouseEvent) => void;
}

export default function ProductModal({ id, handleShoWModal }: IProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getProduct(id: number) {
    try {
      const product = await db.product.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });

      return product;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  useEffect(() => {
    (async () => {
      const product = await getProduct(id);

      setProduct(product);
      setIsLoading(false);
    })();
  }, [id]);

  if (isLoading) {
    return (
      <div
        className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0"
        onClick={handleShoWModal}
      >
        <div className="max-w-screen-sm h-1/2  flex justify-center w-full">
          <div className="aspect-square  bg-neutral-700 text-neutral-200  rounded-md flex justify-center items-center">
            <PhotoIcon className="h-28" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>없음</div>;
  }

  console.log(product);

  return <div>{`id: ${id}`}</div>;
}
