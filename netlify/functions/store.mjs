const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(body)
  };
}

function getBlobContext() {
  const raw = process.env.NETLIFY_BLOBS_CONTEXT;
  if (!raw) throw new Error('NETLIFY_BLOBS_CONTEXT is missing');
  const decoded = Buffer.from(raw, 'base64').toString('utf8');
  const context = JSON.parse(decoded);
  if (!context.siteID || !context.token || !context.edgeURL) {
    throw new Error('NETLIFY_BLOBS_CONTEXT is missing siteID, token, or edgeURL');
  }
  return context;
}

function getBlobUrl(context) {
  const edgeURL = String(context.edgeURL).replace(/\/$/, '');
  return `${edgeURL}/${context.siteID}/site:dashboard/state`;
}

async function readJsonBody(event) {
  if (!event.body) return null;
  const text = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  return JSON.parse(text);
}

export const config = { path: '/.netlify/functions/store' };

export async function handler(event) {
  try {
    const method = event.httpMethod || 'GET';
    const context = getBlobContext();
    const url = getBlobUrl(context);
    const authHeaders = { Authorization: `Bearer ${context.token}` };

    if (method === 'GET') {
      const response = await fetch(url, { headers: authHeaders });
      if (response.status === 404) return json(200, {});
      if (!response.ok) {
        return json(response.status, { error: 'blob_read_failed', detail: await response.text() });
      }
      const text = await response.text();
      return json(200, text ? JSON.parse(text) : {});
    }

    if (method === 'PUT' || method === 'POST') {
      const body = await readJsonBody(event);
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return json(400, { error: 'invalid_body', detail: 'Expected a JSON object.' });
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        return json(response.status, { error: 'blob_write_failed', detail: await response.text() });
      }

      return json(200, { ok: true });
    }

    return json(405, { error: 'method_not_allowed', detail: `${method} is not supported.` });
  } catch (error) {
    return json(500, {
      error: 'store_function_failed',
      detail: error instanceof Error ? error.message : String(error)
    });
  }
}
