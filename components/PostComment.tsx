import { getDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface IProps {
  comment: {
    user: {
      username: string;
      avatar: string | null;
    };
  } & {
    id: number;
    created_at: Date;
    updated_at: Date;
    userId: number;
    postId: number;
    payload: string;
  };
}

export default function PostComment({ comment }: IProps) {
  const {
    user: { username, avatar },
    created_at: createdAt,
    payload,
  } = comment;

  return (
    <>
      <div
        style={{ minWidth: "100px" }}
        className="flex items-center gap-2 p-1"
      >
        <div className="overflow-hidden rounded-full">
          {avatar ? (
            <Image src={avatar} width={40} height={40} alt={username} />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>{username}</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px",
          alignItems: "center",
          gap: "8px",
          padding: "4px",
          width: "100%",
        }}
      >
        <div>{payload}</div>
        <span style={{ fontSize: "10px" }}>{getDate(createdAt)}</span>
      </div>
    </>
  );
}
