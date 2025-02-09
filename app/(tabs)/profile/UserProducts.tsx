"use client";

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
  if (products.length === 0) {
    return <div>등록된 상품이 없습니다.</div>;
  }

  return (
    <div>
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
}
