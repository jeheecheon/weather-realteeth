/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "true" to enable React StrictMode. Disabled when unset. */
  readonly VITE_STRICT_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
