// lib/api/broker.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchBranch = async () => {
  const res = await fetch(`${BASE_URL}/branches`);
  return res.json();
};

export const createBranches = async (data: any) => {
  const res = await fetch(`${BASE_URL}/branches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateBranches = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/branches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBranches = async (id: string) => {
  const res = await fetch(`${BASE_URL}/branches/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
};
