const SUPABASE_URL = 'https://fdtwwlgnaokfnbrizcly.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9FvFLJFl1XfoVc8Zu1pcBQ_wuz8AyB_';

export async function supabaseRequest(table, options = {}) {
  const { method = 'GET', id, body, query = 'select=*&order=id.desc' } = options;
  const suffix = id ? `?id=eq.${id}` : `?${query}`;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${suffix}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(await response.text());
  if (response.status === 204) return null;
  return response.json();
}
