/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_SLUG: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_NEON_DATABASE_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_ADMIN_EMAIL: string;
  readonly VITE_BUSINESS_NAME: string;
  readonly VITE_BUSINESS_PHONE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
