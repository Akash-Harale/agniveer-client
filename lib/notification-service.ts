import { API_ENDPOINTS } from './api-config';

export interface NotificationFromAPI {
  _id: string;
  advertisement_number: string;
  date_of_advertisement: string;
  application_opening_date: string;
  application_closing_date: string;
  notification_title: string;
  description: string;
  job_link_url?: string;
  entity_id: string;
  sub_entity_id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateNotificationPayload {
  advertisement_number: string;
  date_of_advertisement: string;
  application_opening_date: string;
  application_closing_date: string;
  notification_title: string;
  description: string;
  job_link_url?: string;
  entity_id: string;
  sub_entity_id: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getAllNotifications(): Promise<NotificationFromAPI[]> {
  const res = await fetch(API_ENDPOINTS.GET_ALL_NOTIFICATIONS, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await handleResponse<{ notifications: NotificationFromAPI[] }>(res);
  return data.notifications;
}

export async function getNotificationById(id: string): Promise<NotificationFromAPI> {
  const res = await fetch(`/api/proxy/notification/get-notification/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await handleResponse<{ notification: NotificationFromAPI; message: string }>(res);
  return data.notification;
}

export async function createNotification(payload: CreateNotificationPayload): Promise<NotificationFromAPI> {
  const res = await fetch(API_ENDPOINTS.CREATE_NOTIFICATION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ notification: NotificationFromAPI }>(res);
  return data.notification;
}