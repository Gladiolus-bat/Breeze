const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/user";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...API_BASE(options.headers || {}),
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
