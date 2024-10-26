"use client";

import { useEffect, useRef, useState } from "react";

import { getMoreProducts } from "@/app/(tabs)/products/actions";
import { InitialProducts } from "@/app/(tabs)/products/page";

import ListProduct from "./ListProduct";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  const onLoadMoreClick = async () => {
    setIsLoading(true);

    const newProducts = await getMoreProducts(page + 1);

    if (newProducts.length !== 0) {
      setProducts((prev) => [...prev, ...newProducts]);
      setPage((prev) => prev + 1);
    } else {
      setIsLastPage(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];

        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);

          await onLoadMoreClick();
        }
      },
      { threshold: 1.0 }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? null : (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "Load more"}
        </span>
      )}
    </div>
  );
}
