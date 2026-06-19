import { cn } from "@/shared/lib";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import type { ComponentProps, PropsWithChildren } from "react";
import { Input } from "./input";

type ComboboxProps<Value> = PropsWithChildren<
  ComboboxPrimitive.Root.Props<Value> & {
    className?: string;
  }
>;

export function Combobox<Value>({ className, children, ...props }: ComboboxProps<Value>) {
  return (
    <ComboboxPrimitive.Root {...props}>
      <div className={cn("relative", className)}>{children}</div>
    </ComboboxPrimitive.Root>
  );
}

type ComboboxInputProps = Omit<ComponentProps<typeof ComboboxPrimitive.Input>, "className"> & {
  className?: string;
};

export function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <ComboboxPrimitive.Input render={<Input className={className} variant="search" />} {...props} />
  );
}

type ComboboxContentProps = ComponentProps<typeof ComboboxPrimitive.Popup> &
  Pick<
    ComponentProps<typeof ComboboxPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  >;

export function ComboboxContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  ...props
}: ComboboxContentProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        className="isolate z-50"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ComboboxPrimitive.Popup
          className={cn(
            "max-h-80 w-(--anchor-width) max-w-(--available-width) overflow-hidden rounded-lg border border-hairline bg-canvas shadow-floating outline-none data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

type ComboboxListProps = ComponentProps<typeof ComboboxPrimitive.List> & {
  className?: string;
};

export function ComboboxList({ className, ...props }: ComboboxListProps) {
  return (
    <ComboboxPrimitive.List
      className={cn("max-h-80 overflow-y-auto py-2xs", className)}
      {...props}
    />
  );
}

type ComboboxItemProps = ComponentProps<typeof ComboboxPrimitive.Item> & {
  className?: string;
};

export function ComboboxItem({ className, ...props }: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        "flex w-full cursor-default items-center justify-between gap-sm px-md py-sm text-left transition-colors outline-none select-none data-highlighted:bg-surface-soft data-highlighted:text-ink data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-meta-soft",
        className,
      )}
      {...props}
    />
  );
}

type ComboboxEmptyProps = ComponentProps<typeof ComboboxPrimitive.Empty> & {
  className?: string;
};

export function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      className={cn("px-md py-sm text-body-sm text-meta", className)}
      {...props}
    />
  );
}
