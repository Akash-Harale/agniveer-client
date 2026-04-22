// lib/user-service.ts

export interface UserFromAPI {
  _id: string;
  entity_id: string;
  sub_entity_id: string;
  officer_name: string;
  rank: string;
  designation: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  entity_id: string;
  sub_entity_id: string;
  officer_name: string;
  rank: string;
  designation: string;
  phone: string;
  email: string;
}

export type UpdateUserPayload = CreateUserPayload;

const BASE = '/api/proxy/user';

/** Safely extract an array from any API response shape */
function toArray(data: any): any[] {
  if (Array.isArray(data))          return data;
  if (Array.isArray(data?.data))    return data.data;
  if (Array.isArray(data?.users))   return data.users;
  if (Array.isArray(data?.result))  return data.result;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export async function getAllUsers(): Promise<UserFromAPI[]> {
  const res = await fetch(`${BASE}/get-all-users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return toArray(data);
}

export async function createUser(payload: CreateUserPayload): Promise<UserFromAPI> {
  const res = await fetch(`${BASE}/create-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create user');
  const data = await res.json();
  return data.data ?? data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<UserFromAPI> {
  const res = await fetch(`${BASE}/update-user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update user');
  const data = await res.json();
  return data.data ?? data;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE}/delete-user/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
}