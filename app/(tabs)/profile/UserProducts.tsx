"use client";

import { useState } from "react";

import Product from "@/components/Product";

interface IProps {
  products: {
    title: string;
    price: number;
    created_at: Date;
    photo: string;
    id: number;
  }[];
}

export default function UserProducts({ products }: IProps) {
  const [showProducts, setShowProducts] = useState(false);

  const handleShoeProducts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setShowProducts((prev) => !prev);
  };

  if (products.length === 0) {
    return <div>등록한 상품이 없습니다.</div>;
  }

  return (
    <div>
      <button onClick={handleShoeProducts}>
        {showProducts ? "접기" : "펼치기"}
      </button>
      {showProducts && (
        <div>
          {products.map((product) => (
            <Product key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
