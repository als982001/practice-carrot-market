import { useEffect, useState } from "react";
import Image from "next/image";

import { PhotoIcon } from "@heroicons/react/24/solid";
import { getProduct } from "@/lib/product";
import { formatToWon } from "@/lib/utils";

interface IProduct {
  user: {
    username: string;
    avatar: string | null;
  };
  id: number;
  title: string;
  price: number;
  photo: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  userId: number;
}

interface IProps {
  id: number;
  handleShoWModal: (e: React.MouseEvent) => void;
}

export default function ProductModal({ id, handleShoWModal }: IProps) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    return (
      <div
        className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0"
        onClick={handleShoWModal}
      >
        해당 상품이 존재하지 않습니다.
      </div>
    );
  }

  return (
    <div
      className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0"
      onClick={handleShoWModal}
    >
      <div className="max-w-screen-sm h-1/2  flex justify-center w-full">
        <div className="aspect-square  bg-neutral-700 text-neutral-200  rounded-md grid grid-rows-[5fr_1fr] items-center justify-items-center">
          {product.photo?.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={product.photo}
                alt={product.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <PhotoIcon className="h-28" />
          )}
          <div className="w-full h-full flex items-center justify-between p-4">
            <span style={{ fontSize: "20px" }}>{product.title}</span>
            <span>{`${formatToWon(product.price)}원`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
