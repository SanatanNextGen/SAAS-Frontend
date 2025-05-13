"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { Plus, FileDown, Edit2, Trash2, Eye } from "lucide-react";
import {
  fetchBrokers,
  createBroker,
  updateBroker,
  deleteBroker,
} from "@/lib/api/broker"; // Adjust the import path as necessary

const BrokerManagement = () => {
  const defaultData = {
    id: "",
    firm: {
      firmName: " ",
      firmType: " ",
      firmPANNumber: "",
      gstin: "",
    },
    firmAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    owner: {
      OwnerFirstName: " ",
      adharNumber: "",
      OwnerLastName: " ",
    },
    OwnerAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    contact: {
      email: "",
      phone: "",
    },
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    },
    Documents: {
      PANCard: "",
      AdharCard: "",
      visitingCard: "",
    },
    tdsDeclaration: false,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [Data, setData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any>(null); // New state for the selected vehicle

  // Fetching the JSON file
  useEffect(() => {
    const getBrokers = async () => {
      const brokers = await fetchBrokers();
      setData(brokers);
    };
    getBrokers();
  }, []);


  const headers = Data.length > 0
  ? Object.keys(Data[0]).filter(
      (key) => !["_id", "__v"].includes(key)
    )
  : [];
  
  const handleSubmit = async (formData: any) => {
    // Check if it's an update or a new entry
    if (formData._id) {
      // Update an existing broker
      try {
        const updated = await updateBroker(formData._id, formData);
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
        const created = await createBroker(formData);
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

    const success = await deleteBroker(id);
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

      if (key === "_id") return;
      // If the value is an object (and not null), call the function recursively

      if (key === "Documents") {
        // Handle documents as files
        Object.keys(value).forEach((doc: any, index: number) => {
          const docKey = `Document${doc}${index + 1}`;
          fields.push({
            id: `${fieldName}.${docKey}`,
            name: `Upload ${doc}`,
            type: "file",
            value: value[docKey],
            key: `${fieldName}.${docKey}`,
            accept: "application/pdf,image/*",
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
          placeholder: `Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`, // Dynamically set the placeholder
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
      "Firm Name",
      "Firm Type",
      "Firm PAN Number",
      "GSTIN",
      "Owner First Name",
      "Owner Last Name",
      "Owner Aadhar Number",
      "Owner Address Street",
      "Owner Address City",
      "Owner Address State",
      "Owner Address Zip",
      "Owner Email",
      "Owner Phone",
      "Bank Account Number",
      "Bank IFSC Code",
      "Bank Name",
      "Created At",
      "Updated At",
    ];
    csvRows.push(headers.join(","));

    Data.forEach((item) => {
      const row = [
        item.firm.firmName,
        item.firm.firmType,
        item.firm.firmPANNumber,
        item.firm.gstin,
        item.owner.OwnerFirstName,
        item.owner.OwnerLastName,
        item.owner.adharNumber,
        item.ownerAddress.street,
        item.ownerAddress.city,
        item.ownerAddress.state,
        item.ownerAddress.zip,
        item.contact.email,
        item.contact.phone,
        item.bankDetails.accountNumber,
        item.bankDetails.ifscCode,
        item.bankDetails.bankName,
        item.createdAt,
        item.updatedAt,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "broker_records.csv");
    a.click();
    URL.revokeObjectURL(url);
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Broker Management
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Broker
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
      <div className="w-[70vw] rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border-b px-6 py-4 text-left text-sm font-semibold text-gray-600"
                  >
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Data?.map((branch, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditData(branch)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(branch._id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded p-1 text-gray-600 hover:bg-gray-50"
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
                            <div className="grid w-20 grid-cols-1 gap-2">
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
                      <td
                        key={header}
                        className="px-6 py-4 text-sm text-gray-800"
                      >
                        {value || "-"}
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
          title="Add New Broker"
          onClose={handleCloseModal}
          fields={transformToFields(defaultData)}
          onSubmit={handleSubmit}
        />
      )}

      {isEditModalOpen && selectedData && (
        <FormModal
          title="Edit Broker Details"
          onClose={handleCloseModal}
          fields={transformToFields(selectedData)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default BrokerManagement;
