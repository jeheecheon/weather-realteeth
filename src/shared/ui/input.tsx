import { cn, ensure } from "@/shared/lib";
import { Search, X } from "lucide-react";
import { useImperativeHandle, useRef, type ComponentProps } from "react";

export type InputProps = ComponentProps<"input"> & {
  variant?: "default" | "search";
};

export function Input({
  ref,
  className,
  type = "text",
  variant = "default",
  ...props
}: InputProps) {
  const innerRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ensure(innerRef.current, "Input ref is not set"));

  return (
    <div className={cn("relative h-11", className)}>
      <input
        ref={innerRef}
        className={cn(
          "peer size-full text-body-md text-ink ring-1 transition-all outline-none ring-inset not-placeholder-shown:pr-11 placeholder:text-meta-soft focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed aria-invalid:ring-2 aria-invalid:ring-semantic-error",
          variant === "default" &&
            "rounded-md bg-canvas px-md ring-hairline-strong hover:ring-ink disabled:bg-surface-strong disabled:text-meta-soft disabled:ring-hairline",
          variant === "search" &&
            "rounded-full bg-surface-soft pr-md pl-11 ring-hairline hover:bg-surface-strong focus-visible:bg-canvas disabled:opacity-50",
        )}
        type={type}
        {...props}
      />
      {variant === "search" && (
        <Search className="pointer-events-none absolute top-1/2 left-md size-md -translate-y-1/2 text-meta" />
      )}
      <button
        className="absolute top-1/2 right-sm inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-meta transition-colors outline-none peer-placeholder-shown:invisible hover:text-ink focus-visible:ring-2 focus-visible:ring-primary active:text-ink"
        type="button"
        aria-label="지우기"
        onClick={handleClear}
      >
        <X className="size-md" />
      </button>
    </div>
  );

  function handleClear() {
    const input = innerRef.current;
    if (!input) {
      return;
    }

    // NOTE: write through the native setter so React's value tracker stays stale — otherwise onChange won't fire.
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  }
}
