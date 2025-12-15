// Simple authentication utilities

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("elfshift_auth") === "authenticated";
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("elfshift_username");
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("elfshift_auth");
  localStorage.removeItem("elfshift_username");
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new CustomEvent("authchange"));
}

export function setAuth(username: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("elfshift_auth", "authenticated");
  localStorage.setItem("elfshift_username", username);
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new CustomEvent("authchange"));
}

export function requireAuth(): boolean {
  return isAuthenticated();
}

