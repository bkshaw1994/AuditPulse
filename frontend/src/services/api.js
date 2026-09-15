function getApiBaseUrl() {
  const envUrl = (typeof window !== 'undefined' && window.RUNTIME_API_BASE_URL)
    || (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    || '/api/audit';

  let cleaned = envUrl.trim().replace(/\/+$/, '');

  if (!cleaned) {
    return '/api/audit';
  }

  // Ensure path ends with /api/audit regardless of how BE url was provided in env
  if (!cleaned.endsWith('/api/audit')) {
    if (cleaned.endsWith('/api')) {
      cleaned = `${cleaned}/audit`;
    } else {
      cleaned = `${cleaned}/api/audit`;
    }
  }

  return cleaned;
}

const API_BASE = getApiBaseUrl();

export async function runAudit(url) {
  const res = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchHistory(url) {
  const res = await fetch(`${API_BASE}/history?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch audit history');
  }
  return await res.json();
}

export async function fetchMonitoredSites() {
  const res = await fetch(`${API_BASE}/sites`);
  if (!res.ok) {
    throw new Error('Failed to fetch monitored sites');
  }
  return await res.json();
}

export async function fetchDiff(crawl1Id, crawl2Id) {
  const res = await fetch(`${API_BASE}/diff?crawl1Id=${crawl1Id}&crawl2Id=${crawl2Id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch historical diff');
  }
  return await res.json();
}
