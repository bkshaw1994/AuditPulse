function getApiRootUrl() {
  const envUrl = (typeof window !== 'undefined' && window.RUNTIME_API_BASE_URL)
    || (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    || '/api';

  let cleaned = envUrl.trim().replace(/\/+$/, '');
  if (!cleaned) {
    return '/api';
  }

  if (cleaned.endsWith('/api/audit')) {
    cleaned = cleaned.slice(0, -'/audit'.length);
  } else if (!cleaned.endsWith('/api')) {
    cleaned = `${cleaned}/api`;
  }

  return cleaned;
}

const API_ROOT = getApiRootUrl();
const API_BASE = `${API_ROOT}/audit`;
const EXTERNAL_AUDIT_BASE = `${API_ROOT}/external-audit`;

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

export async function fetchExternalReport(reportId) {
  const res = await fetch(`${EXTERNAL_AUDIT_BASE}/${encodeURIComponent(reportId)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const err = new Error(errorData.error || `Failed to load report (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return await res.json();
}
