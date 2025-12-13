import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-62ab3e05`;

interface TimeCapsule {
  id: string;
  username: string;
  message: string;
  openDateTime: string;
  createdAt: string;
  opened: boolean;
}

export async function createCapsule(
  username: string,
  password: string,
  message: string,
  openDateTime: string
): Promise<TimeCapsule> {
  const response = await fetch(`${API_BASE}/capsules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ username, password, message, openDateTime }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create capsule');
  }

  const data = await response.json();
  return data.capsule;
}

export async function getCapsules(username: string): Promise<TimeCapsule[]> {
  const response = await fetch(`${API_BASE}/capsules?username=${encodeURIComponent(username)}`, {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch capsules');
  }

  const data = await response.json();
  return data.capsules;
}

export async function unlockCapsule(id: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE}/capsules/${id}/unlock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to unlock capsule');
  }

  const data = await response.json();
  return data.message;
}

export async function deleteCapsule(id: string, username: string): Promise<void> {
  const response = await fetch(`${API_BASE}/capsules/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete capsule');
  }
}
