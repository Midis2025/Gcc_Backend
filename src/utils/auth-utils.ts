export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

/*
// ==================== OLD JWT TOKEN & USER LOCALSTORAGE HELPERS (COMMENTED OUT) ====================
// export function getToken(): string | null {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('gcc_admin_token');
// }
//
// export function setToken(token: string): void {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('gcc_admin_token', token);
//   }
// }
//
// export function removeToken(): void {
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem('gcc_admin_token');
//     localStorage.removeItem('gcc_admin_user');
//   }
// }
//
// export function setStoredUser(user: AuthUser): void {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('gcc_admin_user', JSON.stringify(user));
//   }
// }
//
// export function getStoredUser(): AuthUser | null {
//   if (typeof window === 'undefined') return null;
//   const data = localStorage.getItem('gcc_admin_user');
//   if (!data) return null;
//   try {
//     return JSON.parse(data) as AuthUser;
//   } catch {
//     return null;
//   }
// }
// ====================================================================================================
*/

export function getToken(): string | null {
  return null;
}

export function setToken(_token: string): void {}
export function removeToken(): void {}
export function setStoredUser(_user: AuthUser): void {}
export function getStoredUser(): AuthUser | null {
  return null;
}

export async function apiFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; errors?: Record<string, string[]> }> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: json.message || 'Request failed',
        errors: json.errors,
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Network error',
    };
  }
}
