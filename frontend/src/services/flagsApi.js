const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchFeatureFlags() {
  try {
    const response = await fetch(`${API_BASE_URL}/flags`);
    if (!response.ok) {
      throw new Error(`Failed to fetch flags: ${response.statusText}`);
    }
    const data = await response.json();
    return data.flags || {
      showCliFeature: false,
      showPricingFeature: false,
      showReactProviderFeature: false,
      showLiveDemo: true,
      showFeaturesGrid: true
    };
  } catch (err) {
    console.warn('[flagsApi] Backend connection error, using default flags:', err.message);
    return {
      showCliFeature: false,
      showPricingFeature: false,
      showReactProviderFeature: false,
      showLiveDemo: true,
      showFeaturesGrid: true
    };
  }
}

export async function updateFeatureFlag(key, enabled) {
  try {
    const response = await fetch(`${API_BASE_URL}/flags`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, enabled })
    });
    if (!response.ok) throw new Error('Failed to update flag');
    const data = await response.json();
    return data.flags;
  } catch (err) {
    console.error('[flagsApi] Error updating flag:', err);
    throw err;
  }
}
