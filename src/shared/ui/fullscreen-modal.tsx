import { cn, useCloseOnBack } from "@/shared/lib";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { PropsWithChildren } from "react";
import { Button } from "./button";

type FullscreenModalProps = PropsWithChildren<{
  className?: string;
  headerClassName?: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}>;

export function FullscreenModal({
  className,
  headerClassName,
  isOpen,
  title,
  children,
  onClose,
}: FullscreenModalProps) {
  useCloseOnBack(isOpen, onClose);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex flex-col gap-md bg-canvas p-md outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left",
            className,
          )}
        >
          <div className={cn("flex flex-col gap-2xs pr-xl", headerClassName)}>
            <DialogPrimitive.Title className="text-display-sm text-ink">
              {title}
            </DialogPrimitive.Title>
          </div>

          <DialogPrimitive.Close asChild>
            <Button
              className="absolute top-md right-md"
              size="icon"
              variant="secondary"
              aria-label="닫기"
            >
              <XIcon />
            </Button>
          </DialogPrimitive.Close>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
