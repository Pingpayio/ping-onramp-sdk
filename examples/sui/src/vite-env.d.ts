/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly POPUP_URL: string | null;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
