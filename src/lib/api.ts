export async function apiPost<T>(
  path: string,
  body?: unknown,
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = (res.headers.get('content-type') || '').toLowerCase();
  const isJson = ct.includes('application/json');

  let parsed: any;
  try {
    const text = await res.text();
    parsed = isJson ? JSON.parse(text) : { error: 'non_json', text: text };
  } catch (e){
    // Fallback if parse fails entirely
    parsed = { error: 'parse_failed', text: '' };
  }

  if (!res.ok) {
    const src = res.headers.get('X-Server') || 'upstream';
    const err = new Error(`API ${res.status} ${res.statusText} (${isJson ? 'json' : 'non-json'}) [source=${src}]`);
    (err as any).payload = parsed;
    throw err;
  }

  return parsed as T;
}
