// lib/api/employees.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchEmployees = async () => {
  const res = await fetch(`${BASE_URL}/employees`);
  return res.json();
};

export const createEmployees = async (data: any) => {
  const res = await fetch(`${BASE_URL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateEmployees = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteEmployees = async (id: string) => {
  const res = await fetch(`${BASE_URL}/employees/${id}`, {
    method: "DELETE",
  });
  return res.ok;
};
