import { getQueryClient } from "@/shared/api";
import { QueryClientProvider as _QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type PropsWithChildren } from "react";

export function QueryClientProvider({ children }: PropsWithChildren) {
  const client = getQueryClient();

  return (
    <_QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </_QueryClientProvider>
  );
}
