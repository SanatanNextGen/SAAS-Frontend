// lib/api/broker.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchBrokers = async () => {
  const res = await fetch(`${BASE_URL}/brokers`);
  return res.json();
};

export const createBroker = async (data: any) => {
  const res = await fetch(`${BASE_URL}/brokers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateBroker = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/brokers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBroker = async (id: string) => {
  const res = await fetch(`${BASE_URL}/brokers/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
};
