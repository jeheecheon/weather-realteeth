import { cn } from "@/shared/lib";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

type DialogProps = ComponentProps<typeof DialogPrimitive.Root>;

export function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root {...props} />;
}

type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;

export function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger {...props} />;
}

type DialogCloseProps = ComponentProps<typeof DialogPrimitive.Close>;

export function DialogClose({ ...props }: DialogCloseProps) {
  return <DialogPrimitive.Close {...props} />;
}

type DialogPortalProps = ComponentProps<typeof DialogPrimitive.Portal>;

export function DialogPortal({ ...props }: DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} />;
}

type DialogOverlayProps = ComponentProps<typeof DialogPrimitive.Overlay>;

export function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-scrim/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content>;

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-md rounded-xl bg-canvas p-lg shadow-floating duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-120",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-md right-md inline-flex size-9 items-center justify-center rounded-full bg-surface-soft text-ink transition-colors outline-none hover:bg-surface-strong focus-visible:ring-2 focus-visible:ring-primary active:bg-surface-pressed disabled:pointer-events-none disabled:opacity-50">
          <XIcon className="size-4.5" />
          <span className="sr-only">닫기</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

type DialogHeaderProps = ComponentProps<"div">;

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div className={cn("flex flex-col gap-2xs", className)} {...props} />;
}

type DialogFooterProps = ComponentProps<"div">;

export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-xs sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <DialogPrimitive.Title className={cn("text-display-sm text-ink", className)} {...props} />;
}

type DialogDescriptionProps = ComponentProps<typeof DialogPrimitive.Description>;

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description className={cn("text-body-sm text-meta", className)} {...props} />
  );
}
