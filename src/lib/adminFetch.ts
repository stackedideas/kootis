import { supabase } from "./supabase";

/**
 * Wraps fetch with the current Supabase access token in the Authorization header.
 * Use this for all /api/admin/* calls from the admin panel.
 */
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? "";

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
