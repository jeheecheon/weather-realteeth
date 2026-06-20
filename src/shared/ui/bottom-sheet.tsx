import { cn } from "@/shared/lib";
import type { PropsWithChildren } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./drawer";

type BottomSheetProps = PropsWithChildren<{
  className?: string;
  headerClassName?: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onOpenAutoFocus?: (event: Event) => void;
}>;

export function BottomSheet({
  className,
  headerClassName,
  isOpen,
  title,
  children,
  onClose,
  onOpenAutoFocus,
}: BottomSheetProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Drawer autoFocus repositionInputs={false} open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className={cn("pb-xl", className)} onOpenAutoFocus={onOpenAutoFocus}>
        <DrawerHeader className={headerClassName}>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain px-md">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
