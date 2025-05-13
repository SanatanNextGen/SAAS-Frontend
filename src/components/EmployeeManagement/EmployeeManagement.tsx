"use client";
import React, { useEffect, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { Plus, FileDown, Edit2, Trash2, Eye } from "lucide-react";
import {
  fetchEmployees,
  createEmployees,
  updateEmployees,
  deleteEmployees,
} from "@/lib/api/employee";

const EmployeeManagement = () => {
  const defaultData = {
    personal: {
      firstName: " ",
      lastName: "",
      dob: "",
      gender: "",
    },
    contact: {
      phone: "",
      email: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    position: {
      title: "",
      department: "",
      hireDate: "",
      salary: "",
      workShift: "",
      licenseDetails: {
        licenseNumber: "",
        licenseType: "",
        issueDate: "",
        expiryDate: "",
      },
    },

    emergencyContact: {
      name: " ",
      relation: "",
      phone: "",
      email: "",
    },

    status: {
      employmentStatus: "",
      lastChecked: "",
    },
    performance: "",

    Documents: {
      Documents: "",
    },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [Data, setData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any>(null); // New state for the selected vehicle

  // Fetching the JSON file
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchEmployees();
      setData(response); // Assuming this is an array of vehicles
    };

    fetchData();
  }, []);

  const headers =
    Data.length > 0
      ? Object.keys(Data[0]).filter((key) => !["_id", "__v"].includes(key))
      : [];

  const handleSubmit = async (formData: any) => {
    // Check if it's an update or a new entry
    if (formData._id) {
      // Update an existing broker
      try {
        const updated = await updateEmployees(formData._id, formData);
        setData((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b)),
        );
        setIsEditModalOpen(false); // Close the edit modal after update
      } catch (error) {
        console.error("Error updating broker:", error);
        alert("Error updating broker. Please try again.");
      }
    } else {
      // Create a new broker
      try {
        const created = await createEmployees(formData);
        setData((prev) => [...prev, created]);
        setIsModalOpen(false); // Close the add modal after creating
      } catch (error) {
        console.error("Error creating broker:", error);
        alert("Error creating broker. Please try again.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this broker?");
    if (!confirmed) return;

    const success = await deleteEmployees(id);
    if (success) {
      setData((prev) => prev.filter((broker) => broker.id !== id));
      window.location.reload();
    }
  };

  const transformToFields = (data: any, parentKey: string = ""): any[] => {
    if (!data) return [];

    const fields: any[] = [];

    // Iterate over each key-value pair in the Data
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const fieldName = parentKey ? `${parentKey}.${key}` : key;

      if (key === "id") return;
      // If the value is an object (and not null), call the function recursively

      if (key === "documents") {
        value.forEach((doc: any, index: any) => {
          fields.push({
            id: `${fieldName}.${index}.file`,
            name: `Upload ${doc}`,
            type: "file",
            value: doc.file,
          });
        });
      }

      if (typeof value === "object" && value !== null) {
        // Recursively handle nested objects
        fields.push(...transformToFields(value, fieldName));
      } else {
        // Otherwise, handle the simple property
        fields.push({
          id: fieldName,
          name: fieldName,
          placeholder: `Employee ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`, // Dynamically set the placeholder
          type: getFieldType(value), // Dynamically determine the input type
          value: value, // Format date fields to match input date format
        });
      }
    });

    return fields;
  };

  // Helper function to determine the input field type
  const getFieldType = (value: any): string => {
    if (typeof value === "boolean") return "checkbox"; // Boolean values will map to checkboxes
    if (typeof value === "number") return "number"; // Number values will map to number input

    return "text"; // Default type for strings is text
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false); // Close the edit modal when closing the modal
  };

  const handleEditData = (data: any) => {
    setSelectedData(data); // Set the selected data to show in the edit modal
    setIsEditModalOpen(true); // Open the edit modal for editing
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Date of Birth",
      "Gender",
      "Phone",
      "Email",
      "Street",
      "City",
      "State",
      "Postal Code",
      "Country",
      "Position Title",
      "Department",
      "Hire Date",
      "Salary",
      "Work Shift",
      "Emergency Contact Name",
      "Emergency Contact Relation",
      "Emergency Contact Phone",
      "Emergency Contact Email",
      "Employment Status",
      "Last Checked",
    ];
    csvRows.push(headers.join(","));

    Data.forEach((item) => {
      const row = [
        item.id,
        item.firstName,
        item.lastName,
        item.dob,
        item.gender,
        item.contact.phone,
        item.contact.email,
        item.address.street,
        item.address.city,
        item.address.state,
        item.address.postalCode,
        item.address.country,
        item.position.title,
        item.position.department,
        item.position.hireDate,
        item.position.salary,
        item.position.workShift,
        item.emergencyContact.name,
        item.emergencyContact.relation,
        item.emergencyContact.phone,
        item.emergencyContact.email,
        item.status.employmentStatus,
        item.status.lastChecked,
      ];
      csvRows.push(row.join(","));
    });

    // Create a Blob from the CSV string and trigger a download
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "employee_data.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Management
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </button>
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700"
            >
              <FileDown className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6 w-[80vw] rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50/60">
                <th className="w-[100px] border-b border-gray-200 bg-gray-50/60 px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-gray-600">
                    Actions
                  </span>
                </th>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border-b border-gray-200 bg-gray-50/60 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-gray-600">
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Data?.map((branch, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-start gap-2">
                      <button
                        onClick={() => handleEditData(branch)}
                        className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(branch._id)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  {headers.map((header) => {
                    const value = header.includes(".")
                      ? header
                          .split(".")
                          .reduce((o, i) => (o ? o[i] : null), branch)
                      : branch[header];

                    if (typeof value === "object" && value !== null) {
                      return (
                        <td key={header} className="px-6 py-4">
                          <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 p-2">
                            <div className="grid grid-cols-1 gap-2">
                              {Object.entries(value).map(([key, val]) => (
                                <div key={key} className="text-sm">
                                  <span className="font-semibold text-gray-900">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    :
                                  </span>{" "}
                                  <span className="text-gray-800">
                                    {String(val)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={header} className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {value || "-"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <FormModal
          title="Add New Employee"
          onClose={handleCloseModal}
          fields={transformToFields(defaultData)}
          onSubmit={handleSubmit}
        />
      )}

      {isEditModalOpen && selectedData && (
        <FormModal
          title="Edit Employee Details"
          onClose={handleCloseModal}
          fields={transformToFields(selectedData)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
