// lib/api/consignees.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchConsignees = async () => {
  const res = await fetch(`${BASE_URL}/consignees`);
  return res.json();
};

export const createConsignee = async (data: any) => {
  const res = await fetch(`${BASE_URL}/consignees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateConsignee = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/consignees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteConsignee = async (id: string) => {
  const res = await fetch(`${BASE_URL}/consignees/${id}`, {
    method: "DELETE",
  });
  return res.ok;
};
