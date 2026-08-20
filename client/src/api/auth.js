const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/user";

async function request (path, options = {}) {
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