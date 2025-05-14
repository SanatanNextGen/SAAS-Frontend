// lib/api/ChallanForm.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchChallanForm = async () => {
  const res = await fetch(`${BASE_URL}/challanForm`);
  return res.json();
};

export const createChallanForm = async (data: any) => {
  const res = await fetch(`${BASE_URL}/challanForm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateChallanForm = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/challanForm/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteChallanForm = async (id: string) => {
  const res = await fetch(`${BASE_URL}/challanForm/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
};
