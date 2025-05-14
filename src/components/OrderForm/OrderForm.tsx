"use client";
import React, { useEffect, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { Edit2, Eye, FileDown, Plus, Trash2 } from "lucide-react";
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "@/lib/api/orderForm";

const VehicleManagement = () => {
  const defaultData = {
    partyName: "",
    fromStation: "",
    toStation: "",
    fromDate: "",
    toDate: "",
    vehicleRequired: "",
    vehicleType: "",
    orderClose: false,
  };

  const stationData = {
    stationName: "",
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = [
      "Party Name",
      "From Station",
      "To Station",
      "From Date",
      "To Date",
      "Vehicle Required",
      "Vehicle Type",
      "Order Closed",
    ];
    csvRows.push(headers.join(","));

    Data.forEach((item) => {
      const row = [
        item.partyName,
        item.fromStation,
        item.toStation,
        item.fromDate,
        item.toDate,
        item.vehicleRequired,
        item.vehicleType,
        item.orderClosed,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "order_records.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [Data, setData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchOrders();
      setData(response);
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
        const updated = await updateOrder(formData._id, formData);
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
        const created = await createOrder(formData);
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

    const success = await deleteOrder(id);
    if (success) {
      setData((prev) => prev.filter((broker) => broker.id !== id));
      window.location.reload();
    }
  };

  const transformToFields = (data: any, parentKey: string = ""): any[] => {
    if (!data) return [];
    const fields: any[] = [];

    Object.keys(data).forEach((key) => {
      const value = data[key];
      const fieldName = parentKey ? `${parentKey}.${key}` : key;

      if (key === "id") return; // Skip the ID field

      if (key === "documents") {
        value.forEach((doc: any, index: any) => {
          fields.push({
            id: `${fieldName}.${index}.file`,
            name: `Upload Document ${index + 1}`,
            type: "file",
            value: doc.file,
          });
        });
      }

      if (typeof value === "object" && value !== null) {
        // Recursively transform nested objects
        fields.push(...transformToFields(value, fieldName));
      } else {
        // Create a field object for primitive values
        fields.push({
          id: fieldName,
          name: fieldName,
          placeholder: `Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          type: getFieldType(value, fieldName), // Pass fieldName to getFieldType
          value: value,
        });
      }
    });

    return fields;
  };

  const getFieldType = (value: any, fieldName: string): string => {
    if (typeof value === "boolean") return "checkbox";
    if (typeof value === "number") return "number";

    return "text"; // Default to text for other strings
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsStationModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleEditData = (data: any) => {
    setSelectedData(data);
    setIsEditModalOpen(true);
  };

  const handleOpenStationMOdal = () => {
    setIsStationModalOpen(true);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Order
            </button>
            <button
              onClick={handleOpenStationMOdal}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Station
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
              {Data?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditData(item)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
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
                          .reduce((o, i) => (o ? o[i] : null), item)
                      : item[header];

                    // Handle case when the value is an object (and not null)
                    if (
                      typeof value === "object" &&
                      value !== null &&
                      !Array.isArray(value)
                    ) {
                      return (
                        <td key={header} className="px-6 py-4">
                          <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 p-2">
                            {Object.entries(value).map(([key, val]) => (
                              <div key={key} className="mb-1 text-sm">
                                <span className="font-semibold text-gray-900">
                                  {key}:
                                </span>{" "}
                                <span className="text-gray-800">
                                  {String(val)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      );
                    }

                    // Handle case when the value is an array (for Tyre)
                    if (Array.isArray(value) && value.length > 0) {
                      return (
                        <td key={header} className="px-6 py-4">
                          <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 p-2">
                            {value.map((tyre, index) => (
                              <div key={index} className="mb-2">
                                {Object.entries(tyre).map(([key, val]) => (
                                  <div key={key} className="mb-1 text-sm">
                                    <span className="font-semibold text-gray-900">
                                      {key}:
                                    </span>
                                    <span className="text-gray-800">
                                      {" "}
                                      {String(val)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </td>
                      );
                    }

                    // Default case: render a plain cell for non-object and non-array values
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

      {isStationModalOpen && (
        <FormModal
          title="Add Station"
          onClose={handleCloseModal}
          fields={transformToFields(stationData)}
          onSubmit={handleSubmit}
        />
      )}

      {isModalOpen && (
        <FormModal
          title={"Add New Order"}
          onClose={handleCloseModal}
          fields={transformToFields(defaultData)}
          onSubmit={handleSubmit}
        />
      )}
      {isEditModalOpen && selectedData && (
        <FormModal
          title={"Edit Order"}
          onClose={handleCloseModal}
          fields={transformToFields(selectedData)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default VehicleManagement;
