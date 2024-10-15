/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
  readonly VITE_API_URL: string
  readonly VITE_CSRF_TOKEN_NAME: string
  readonly VITE_SERVER_URL: string
  readonly VITE_PERSISTENT_STORE_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}