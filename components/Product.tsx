import Image from "next/image";
import Link from "next/link";

import { formatToTimeAgo, formatToWon } from "@/lib/utils";

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
  useCloudFlare,
}: IProps) {
  return (
    <Link href={`products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          fill
          src={useCloudFlare ? `${photo}/width=100,height=100` : photo}
          className="object-cover"
          alt={title}
        />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}</span>
      </div>
    </Link>
  );
}
