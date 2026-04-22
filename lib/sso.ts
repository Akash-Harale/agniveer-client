import axios from 'axios';

// ─── PKCE Helpers ────────────────────────────────────────────────────────────

export const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// ─── Token Exchange (calls our own Next.js API route, NOT SSO directly) ──────

export const exchangeCodeForToken = async (
  authorizationCode: string,
  state: string
) => {
  try {
    // Always call our own Next.js API route — never the SSO token endpoint directly
    const response = await axios.post('/api/auth/callback', {
      code: authorizationCode,
      state: state,
    });
    return response.data;
  } catch (error) {
    console.error('SSO exchange error:', error);
    throw new Error('SSO exchange failed');
  }
};