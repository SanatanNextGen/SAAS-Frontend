// lib/api/broker.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchVehicles = async () => {
  const res = await fetch(`${BASE_URL}/vehicles`);
  return res.json();
};

export const createVehicles = async (data: any) => {
  const res = await fetch(`${BASE_URL}/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateVehicles = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteVehicles = async (id: string) => {
  const res = await fetch(`${BASE_URL}/vehicles/${id}`, {
    method: "DELETE",
  });
  return res.ok;
};
