const API_ROOT = import.meta.env.VITE_API_ROOT || "http://localhost:3000/api";

export async function apiRequest(path, { token, isFormData, ...options } = {}) {
  const headers = { ...(options.headers || {}) };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_ROOT}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
