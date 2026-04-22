import { API_ENDPOINTS } from './api-config';

export interface SubEntityFromAPI {
  _id: string;
  parent_entity_id: string;
  sub_entity_name: string;
  short_name: string;
  hq_street_address?: string;
  hq_pincode?: number;
  hq_city?: string;
  hq_state?: string;
  official_website_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubEntityPayload {
  parent_entity_id: string;
  sub_entity_name: string;
  short_name: string;
  hq_street_address?: string;
  hq_pincode?: number;
  hq_city?: string;
  hq_state?: string;
  official_website_url?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getAllSubEntities(): Promise<SubEntityFromAPI[]> {
  const res = await fetch(API_ENDPOINTS.GET_ALL_SUB_ENTITIES, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<SubEntityFromAPI[]>(res);
}

export async function createSubEntity(payload: CreateSubEntityPayload): Promise<SubEntityFromAPI> {
  const res = await fetch(API_ENDPOINTS.CREATE_SUB_ENTITY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<SubEntityFromAPI>(res);
}

export async function updateSubEntity(id: string, payload: CreateSubEntityPayload): Promise<SubEntityFromAPI> {
  const res = await fetch(API_ENDPOINTS.UPDATE_SUB_ENTITY(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<SubEntityFromAPI>(res);
}