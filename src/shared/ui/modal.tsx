import type { PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

type ModalProps = PropsWithChildren<{
  className?: string;
  headerClassName?: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}>;

export function Modal({
  className,
  headerClassName,
  isOpen,
  title,
  children,
  onClose,
}: ModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={className}>
        <DialogHeader className={headerClassName}>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
