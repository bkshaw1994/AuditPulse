const API_BASE = '/api/audit';

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
