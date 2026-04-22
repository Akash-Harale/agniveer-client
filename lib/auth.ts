import { dataService, User } from './data-service';

const SESSION_KEY = 'agniveer_session';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
export const AUTH_CHANGE_EVENT = 'auth-change';

export function dispatchAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export interface Session {
  user: User;
  loginTime: number;
}

export async function login(username: string, password: string): Promise<User | null> {
  try {
    const user = await dataService.validateUser(username, password);
    if (user) {
      const session: Session = {
        user,
        loginTime: Date.now(),
      };
      // Store session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        dispatchAuthChange();
      }
      return user;
    }
    return null;
  } catch (error) {
    console.error('[v0] Login error:', error);
    return null;
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    dispatchAuthChange();
  }
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;

  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const session: Session = JSON.parse(sessionStr);
    // Check if session is still valid
    if (Date.now() - session.loginTime > SESSION_TIMEOUT) {
      logout();
      return null;
    }
    return session;
  } catch (error) {
    console.error('[v0] Error parsing session:', error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function getCurrentUser(): User | null {
  const session = getSession();
  return session ? session.user : null;
}
