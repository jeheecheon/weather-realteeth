import { Toaster } from "react-hot-toast";

type AppToasterProps = {
  className?: string;
};

export function AppToaster({ className }: AppToasterProps) {
  return (
    <Toaster
      containerClassName={className}
      position="top-center"
      toastOptions={{
        className:
          "rounded-lg border border-hairline bg-canvas px-md py-sm font-sans text-body-sm text-center text-ink whitespace-pre-line shadow-floating",
      }}
    />
  );
}
