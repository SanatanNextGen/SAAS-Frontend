// lib/api/BiltyEntry.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchBiltyEntry = async () => {
  const res = await fetch(`${BASE_URL}/biltyEntry`);
  return res.json();
};

export const createBiltyEntry = async (data: any) => {
  const res = await fetch(`${BASE_URL}/biltyEntry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateBiltyEntry = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/biltyEntry/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBiltyEntry = async (id: string) => {
  const res = await fetch(`${BASE_URL}/biltyEntry/${id}`, {
    method: "DELETE",
  });
  return res.ok;
};
