export const BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  GET_ALL_ENTITIES:     `/api/proxy/entity/get-all-entities`,
  CREATE_ENTITY:        `/api/proxy/entity/create-entity`,
  UPDATE_ENTITY:        (id: string) => `/api/proxy/entity/update-entity/${id}`,

  GET_ALL_SUB_ENTITIES: `/api/proxy/sub-entity/get-all-sub-entities`,
  CREATE_SUB_ENTITY:    `/api/proxy/sub-entity/create-sub-entity`,
  UPDATE_SUB_ENTITY:    (id: string) => `/api/proxy/sub-entity/update-sub-entity/${id}`,

  GET_ALL_NOTIFICATIONS: `/api/proxy/notification/get-all-notifications`,
  CREATE_NOTIFICATION:   `/api/proxy/notification/create-notification`,

  // ── Agniveer Profile ──────────────────────────────────────
  GET_ALL_AGNIVEER_PROFILES: `/api/proxy/agniveer-profile/get-all-agniveer-profiles`,

  // ── Post Agniveer Profile ─────────────────────────────────
  GET_ALL_POST_AGNIVEER_PROFILES: `/api/proxy/post-agniveer-profile/get-all-post-agniveer-profiles`,

  // Qualification
  ADD_QUALIFICATION:    (profileId: string) =>
    `/api/proxy/post-agniveer-profile/update/${profileId}/add-qualification`,
  UPDATE_QUALIFICATION: (profileId: string, qualId: string) =>
    `/api/proxy/post-agniveer-profile/update/${profileId}/update-qualification/${qualId}`,

  // Employment
  ADD_EMPLOYMENT:       (profileId: string) =>
    `/api/proxy/post-agniveer-profile/update/${profileId}/add-employment`,
  UPDATE_EMPLOYMENT:    (profileId: string, empId: string) =>
    `/api/proxy/post-agniveer-profile/update/${profileId}/update-employment/${empId}`,

  // Training
  ADD_TRAINING:         (profileId: string) =>
    `/api/proxy/post-agniveer-profile/update/${profileId}/add-training`,
  UPDATE_TRAINING:      (profileId: string, trainId: string) =>
    `/api/proxy/post-agniveer-profile/update/${profileId}/update-training/${trainId}`,

  // Certification
  ADD_CERTIFICATION:    (profileId: string) =>
    `/api/proxy/post-agniveer-profile/update/${profileId}/add-certification`,
  UPDATE_CERTIFICATION: (profileId: string, certId: string) =>
    `/api/proxy/post-agniveer-profile/update/${profileId}/update-certification/${certId}`,
};