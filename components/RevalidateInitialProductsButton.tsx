"use client";

import { useTransition } from "react";

import { ArrowPathIcon } from "@heroicons/react/24/solid";

export default function RevalidateInitialProductsButton() {
  const [isPending, startTransition] = useTransition();

  const handleRevalidate = async () => {
    startTransition(async () => {
      await fetch("/api/revalidate", { method: "POST" });
      window.location.reload();
    });
  };

  return (
    <button onClick={handleRevalidate} disabled={isPending}>
      {isPending ? "Refreshing..." : <ArrowPathIcon className="size-7" />}
    </button>
  );
}
