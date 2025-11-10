/**
 * SSR-safe localStorage utilities
 */

const STORAGE_KEY = 'profileAccess';

export interface AccessData {
  name: string;
  email: string;
  company?: string;
  timestamp: string;
  granted: boolean;
}

export function getAccessData(): AccessData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const data = JSON.parse(stored) as AccessData;

    // Check if access is still valid (30 days)
    const timestamp = new Date(data.timestamp);
    const now = new Date();
    const daysDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 30) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function setAccessData(data: Omit<AccessData, 'timestamp' | 'granted'>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const accessData: AccessData = {
      ...data,
      timestamp: new Date().toISOString(),
      granted: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accessData));
  } catch (error) {
    console.error('Failed to save access data:', error);
  }
}

export function clearAccessData(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}
