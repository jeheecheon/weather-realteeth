import { cn } from "@/shared/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-xs whitespace-nowrap rounded-md text-button-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed disabled:bg-primary-disabled",
        destructive:
          "border border-semantic-error bg-canvas text-semantic-error hover:bg-semantic-error-soft active:bg-semantic-error-soft focus-visible:ring-semantic-error disabled:opacity-50",
        outline:
          "border border-hairline-strong bg-canvas text-ink hover:bg-surface-soft active:bg-surface-pressed disabled:opacity-50",
        secondary:
          "border border-hairline bg-canvas text-ink hover:bg-surface-soft active:bg-surface-pressed disabled:opacity-50",
        ghost: "text-ink hover:bg-surface-soft active:bg-surface-pressed disabled:opacity-50",
        link: "text-primary underline-offset-4 hover:underline disabled:opacity-50",
      },
      size: {
        default: "h-11 px-md",
        sm: "h-9 gap-2xs px-sm text-button-sm",
        lg: "h-12 px-lg",
        icon: "size-9 rounded-full p-0 focus-visible:ring-offset-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
