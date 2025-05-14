// lib/api/pod.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPod = async () => {
  const res = await fetch(`${BASE_URL}/pod`);
  return res.json();
};

export const createPod = async (data: any) => {
  const res = await fetch(`${BASE_URL}/pod`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updatePod = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/pod/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deletePod = async (id: string) => {
  const res = await fetch(`${BASE_URL}/pod/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
};
