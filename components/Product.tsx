import Image from "next/image";
import Link from "next/link";

import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import ProductModalButton from "./ProductModalButton";

interface IProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  useCloudFlare?: boolean;
}

export default function Product({
  title,
  price,
  created_at,
  photo,
  id,
}: IProps) {
  return (
    <Link href={`products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image fill src={photo} className="object-cover" alt={title} />
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1 *:text-white">
          <span className="text-lg">{title}</span>
          <span className="text-sm text-neutral-500">
            {formatToTimeAgo(created_at.toString())}
          </span>
          <span className="text-l4g font-semibold">{formatToWon(price)}</span>
        </div>
        <ProductModalButton id={id} />
      </div>
    </Link>
  );
}
