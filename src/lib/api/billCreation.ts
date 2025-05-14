// lib/api/BillCreations.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchBillCreations = async () => {
  const res = await fetch(`${BASE_URL}/billCreation`);
  return res.json();
};

export const createBillCreations = async (data: any) => {
  const res = await fetch(`${BASE_URL}/billCreation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateBillCreations = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/billCreation/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBillCreations = async (id: string) => {
  const res = await fetch(`${BASE_URL}/billCreation/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
};
