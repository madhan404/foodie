const BASE_URL = "http://localhost:3000"; // Replace with your API base URL

const apiClient = {
  async get(url) {
    const res = await fetch(BASE_URL + url, { credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },
  async post(url, data) {
    const res = await fetch(BASE_URL + url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },
  async put(url, data) {
    const res = await fetch(BASE_URL + url, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },
  async delete(url) {
    const res = await fetch(BASE_URL + url, {
      method: "DELETE",
      credentials: "include"
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }
};

export default apiClient;
