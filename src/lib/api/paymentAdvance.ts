// lib/api/PaymentAdvance.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPaymentAdvance = async () => {
  const res = await fetch(`${BASE_URL}/paymentAdvance`);
  return res.json();
};

export const createPaymentAdvance = async (data: any) => {
  const res = await fetch(`${BASE_URL}/paymentAdvance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updatePaymentAdvance = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/paymentAdvance/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deletePaymentAdvance = async (id: string) => {
  const res = await fetch(`${BASE_URL}/paymentAdvance/${id}`, {
    method: "DELETE",
  });
  return res.ok;
};
