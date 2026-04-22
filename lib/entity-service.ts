import { API_ENDPOINTS } from './api-config';

export interface Entity {
  _id: string;
  entity_name: string;
  short_name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEntityPayload {
  entity_name: string;
  short_name: string;
  description: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getAllEntities(): Promise<Entity[]> {
  const res = await fetch(API_ENDPOINTS.GET_ALL_ENTITIES, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Entity[]>(res);
}

export async function createEntity(payload: CreateEntityPayload): Promise<Entity> {
  const res = await fetch(API_ENDPOINTS.CREATE_ENTITY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Entity>(res);
}

// PUT /entity/update-entity/:id
export async function updateEntity(id: string, payload: CreateEntityPayload): Promise<Entity> {
  const res = await fetch(API_ENDPOINTS.UPDATE_ENTITY(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Entity>(res);
}