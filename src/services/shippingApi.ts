/**
 * shippingApi.ts
 * Reusable API service for external shipping data integration.
 * Built using the environment variable VITE_SHIPPING_API_KEY.
 */

const API_KEY = import.meta.env.VITE_SHIPPING_API_KEY;

if (!API_KEY) {
  console.warn('VITE_SHIPPING_API_KEY is not defined in .env. API calls will fail or be stubbed.');
}

/**
 * Example generic fetcher for external shipping API
 */
async function fetchFromShippingApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Stubbing for demo purposes
    console.log(`[Shipping API] Called ${endpoint} with options:`, options);
    return {} as T;
  } catch (error) {
    console.error('External API Request Failed:', error);
    throw error;
  }
}

export const shippingApi = {
  getVesselTelemetry: (vesselId: string) => fetchFromShippingApi(`/vessels/${vesselId}/telemetry`),
  calculateOptimizedRoute: (originLat: number, originLon: number, destLat: number, destLon: number) => 
    fetchFromShippingApi('/routes/optimize', {
      method: 'POST',
      body: JSON.stringify({ originLat, originLon, destLat, destLon }),
    }),
};
