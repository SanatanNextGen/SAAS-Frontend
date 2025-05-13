// lib/api/consignor.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchConsignors = async () => {
  const res = await fetch(`${BASE_URL}/consignors`);
  return res.json();
};

export const createConsignor = async (data: any) => {
  const res = await fetch(`${BASE_URL}/consignors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateConsignor = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/consignors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteConsignor = async (id: string) => {
  const res = await fetch(`${BASE_URL}/consignors/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
};
