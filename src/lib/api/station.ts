// lib/api/Stations.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchStations = async () => {
  const res = await fetch(`${BASE_URL}/stations`);
  return res.json();
};

export const createStations = async (data: any) => {
  const res = await fetch(`${BASE_URL}/stations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateStations = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/stations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteStations = async (id: string) => {
  const res = await fetch(`${BASE_URL}/stations/${id}`, {
    method: "DELETE",
  });
  return res.ok;
};
