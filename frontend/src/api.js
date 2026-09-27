async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `Something went wrong (${response.status}).`);
  }
  return body.response;
}

export const findRecipe = (cuisine, ingrs) =>
  request("/recipes", { method: "POST", body: JSON.stringify({ cuisine, ingrs }) });

export const getRecipe = (id) => request(`/recipes/${encodeURIComponent(id)}`);

export const likeRecipe = (id, liked) =>
  request(`/recipes/${encodeURIComponent(id)}/like`, {
    method: "POST",
    body: JSON.stringify({ liked }),
  });

export const getTodaysRanking = () => request("/ranking");
