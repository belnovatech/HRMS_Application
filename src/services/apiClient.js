const API_BASE = "https://belnova-hrms-be-tckt.onrender.com";

// TODO: adjust this if your login flow stores the token under a
// different key, or in a cookie / context instead of localStorage.
function getAuthToken() {
  return (
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

function buildHeaders(extra = {}) {
  const token = getAuthToken();
  return {
    accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const errBody = await res.json();
      message = errBody?.detail || errBody?.message || message;
    } catch {
      // response wasn't JSON, ignore
    }

    if (res.status === 401 || res.status === 403) {
      message =
        "You're not authorized to do this. Your session may have expired — try logging in again.";
    }

    throw new Error(message);
  }

  // DELETE routes and some POSTs may return an empty body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/**
 * GET request. Query params object is optional.
 */
export async function apiGet(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();

  const url = `${API_BASE}${path}${query ? `?${query}` : ""}`;

  const res = await fetch(url, { headers: buildHeaders() });
  return handleResponse(res);
}

/**
 * POST request with a JSON body.
 */
export async function apiPostJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

/**
 * POST request with a multipart/form-data body (file uploads etc).
 * Do NOT set Content-Type manually — the browser sets the correct
 * multipart boundary automatically.
 */
export async function apiPostForm(path, fields) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: formData,
  });

  return handleResponse(res);
}

/**
 * DELETE request.
 */
export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  return handleResponse(res);
}