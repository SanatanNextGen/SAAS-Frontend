// lib/api/Orders.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`);
  return res.json();
};

export const createOrder = async (data: any) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateOrder = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteOrder = async (id: string) => {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
};
