"use client";

import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Modal({ children }: Props) {
  const router = useRouter();
  const handleOpenChange = () => {
    router.back();
  };
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      {children}
    </Dialog>
  );
}
