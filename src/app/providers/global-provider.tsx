import { type PropsWithChildren } from "react";
import { SyncedStorageProvider } from "synced-storage/react";
import { QueryClientProvider } from "./query-client-provider";

type GlobalProviderProps = PropsWithChildren;

export function GlobalProvider({ children }: GlobalProviderProps) {
  return (
    <SyncedStorageProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </SyncedStorageProvider>
  );
}
