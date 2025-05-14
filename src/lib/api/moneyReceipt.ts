// lib/api/MoneyReceipt.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchMoneyReceipt = async () => {
  const res = await fetch(`${BASE_URL}/moneyReceipt`);
  return res.json();
};

export const createMoneyReceipt = async (data: any) => {
  const res = await fetch(`${BASE_URL}/moneyReceipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateMoneyReceipt = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/moneyReceipt/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteMoneyReceipt = async (id: string) => {
  const res = await fetch(`${BASE_URL}/moneyReceipt/${id}`, {
    method: "DELETE",
  });
  return res.ok;
};
