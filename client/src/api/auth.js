const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/user";

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const registerUser = ({ email, password, username }) =>
  request("/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });

export const loginUser = ({ email, password }) =>
  request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Verifies if a stored toke is still valid
export const fetchCurrentUser = (token) =>
  request("/", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

// formData may include username and/or an image file
export const updateProfile = (formData, token) =>
  request("/profile", {
    method: "PUT",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });

export const changePassword = ({ currentPassword, newPassword }, token) =>
  request("/change-password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
    headers: { Authorization: `Bearer ${token}` },
  });
