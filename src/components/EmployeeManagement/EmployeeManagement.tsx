"use client";
import React, { useEffect, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { Plus, FileDown, Edit2, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchEmployees,
  createEmployees,
  updateEmployees,
  deleteEmployees,
} from "@/lib/api/employee";

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

const EmployeeManagement = () => {
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [Data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedData, setSelectedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetching the JSON file
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchEmployees();
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(Data);
    } else {
      const filtered = Data.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.businessName?.toLowerCase().includes(searchLower) ||
          item.contact?.email?.toLowerCase().includes(searchLower) ||
          item.contact?.phone?.includes(searchTerm) ||
          item.gstin?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, Data]);

  const handleSubmit = async (formData: any) => {
    // Check if it's an update or a new entry
    if (selectedData && selectedData._id) {
      // Update an existing employee - ensure we're using the _id from selectedData
      try {
        const updatedData = {
          ...formData,
          _id: selectedData._id // Ensure _id is preserved
        };
        
        const updated = await updateEmployees(selectedData._id, updatedData);
        
        setData((prev) =>
          prev.map((item) => (item._id === selectedData._id ? updated : item))
        );
        
        setSelectedData(null); // Reset selected data
        setIsEditModalOpen(false); // Close the edit modal after update
      } catch (error) {
        console.error("Error updating employee:", error);
        alert("Error updating employee. Please try again.");
      }
    } else {
      // Create a new employee
      try {
        const created = await createEmployees(formData);
        setData((prev) => [...prev, created]);
        setIsModalOpen(false); // Close the add modal after creating
      } catch (error) {
        console.error("Error creating employee:", error);
        alert("Error creating employee. Please try again.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteEmployees(id);
    if (success) {
      setData((prev) => prev.filter((employee) => employee._id !== id));
      setDeleteConfirmId(null);
    }
  };

  const transformToFields = (data: any, parentKey: string = ""): any[] => {
    if (!data) return [];

    // Order based on defaultData structure
    const orderedFields: any[] = [];
    const fieldsByKey: Record<string, any> = {};

    const processObject = (obj: any, prefix: string = "") => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const fieldName = prefix ? `${prefix}.${key}` : key;

        if (key === "id" || key === "_id") return;

        if (key === "Documents") {
          Object.entries(value).forEach(([docKey, docVal]) => {
            const field = {
              id: `${fieldName}.${docKey}`,
              name: `Upload ${docKey}`,
              type: "file",
              value: docVal,
              key: `${fieldName}.${docKey}`,
              accept: "application/pdf,image/*",
            };
            fieldsByKey[`${fieldName}.${docKey}`] = field;
          });
        } else if (typeof value === "object" && value !== null) {
          processObject(value, fieldName);
        } else {
          const field = {
            id: fieldName,
            name: fieldName,
            placeholder: `Employee ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`,
            type: getFieldType(value),
            value: value,
          };
          fieldsByKey[fieldName] = field;
        }
      });
    };

    // Process data to collect all fields
    processObject(data);

    // Process default data to ensure correct order
    const processDefaultDataOrder = (obj: any, prefix: string = "") => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const fieldName = prefix ? `${prefix}.${key}` : key;

        if (key === "id" || key === "_id") return;

        if (key === "Documents") {
          Object.entries(value).forEach(([docKey]) => {
            const fullKey = `${fieldName}.${docKey}`;
            if (fieldsByKey[fullKey]) {
              orderedFields.push(fieldsByKey[fullKey]);
              delete fieldsByKey[fullKey];
            }
          });
        } else if (typeof value === "object" && value !== null) {
          processDefaultDataOrder(value, fieldName);
        } else {
          if (fieldsByKey[fieldName]) {
            orderedFields.push(fieldsByKey[fieldName]);
            delete fieldsByKey[fieldName];
          }
        }
      });
    };

    // Process default data structure to get the right order
    processDefaultDataOrder(defaultData);

    // Add any remaining fields that might not be in defaultData
    Object.values(fieldsByKey).forEach((field) => {
      orderedFields.push(field);
    });

    return orderedFields;
  };

  const getFieldType = (value: any): string => {
    if (typeof value === "boolean") return "checkbox";
    if (typeof value === "number") return "number";
    return "text";
  };

  const handleOpenModal = () => {
    setSelectedData(null); // Reset selected data when opening add modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedData(null); // Reset selected data when closing modals
  };

  const handleEditData = (data: any) => {
    setSelectedData(data);
    setIsEditModalOpen(true);
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "BusinessName",
      "Email",
      "Phone",
      "Street",
      "City",
      "State",
      "Zip",
      "GSTIN",
      "Account Number",
      "IFSC Code",
      "Bank Name",
      "Created At",
      "Updated At",
    ];
    csvRows.push(headers.join(","));

    Data.forEach((item: any) => {
      const row = [
        item.id,
        item.businessName,
        item.contact?.email,
        item.contact?.phone,
        item.address?.street,
        item.address?.city,
        item.address?.state,
        item.address?.zip,
        item.gstin,
        item.bankDetails?.accountNumber,
        item.bankDetails?.ifscCode,
        item.bankDetails?.bankName,
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
    a.setAttribute("download", "employee_records.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate ordered headers based on defaultData structure
  const getOrderedHeaders = () => {
    if (Data.length === 0) return [];

    const orderedKeys: string[] = [];
    const defaultKeys = Object.keys(defaultData);

    // First add keys that match the default data order
    defaultKeys.forEach((key) => {
      if (Data[0].hasOwnProperty(key) && !["_id", "__v"].includes(key)) {
        orderedKeys.push(key);
      }
    });

    // Then add any remaining keys from the data
    Object.keys(Data[0]).forEach((key) => {
      if (!orderedKeys.includes(key) && !["_id", "__v"].includes(key)) {
        orderedKeys.push(key);
      }
    });

    return orderedKeys;
  };

  const headers = getOrderedHeaders().filter(
    (key) => !["_id", "__v", "createdAt"].includes(key),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-96 rounded-xl bg-white p-6 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="mb-4 text-xl font-bold text-gray-800">
                Confirm Deletion
              </h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete this employee? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        className="mb-8 overflow-hidden rounded-xl bg-white p-6 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <motion.h1
              className="text-3xl font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Employee Management
            </motion.h1>
            <motion.p
              className="mt-2 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage all your employees in one place
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
            >
              <FileDown className="h-4 w-4" />
              Export CSV
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="mb-6 rounded-xl bg-white p-4 shadow-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name, email, phone or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        className="w-[72vw] overflow-x-auto  rounded-xl bg-white shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
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
                <AnimatePresence>
                  {filteredData.map((branch, index) => (
                    <motion.tr
                      key={branch._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group hover:bg-blue-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditData(branch)}
                            className="rounded-full p-2 text-blue-600 transition-colors hover:bg-blue-100"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDeleteConfirmId(branch._id)}
                            className="rounded-full p-2 text-red-600 transition-colors hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
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
                              <motion.div
                                initial={{ height: "auto" }}
                                whileHover={{ scale: 1.02 }}
                                className="max-h-32 w-35 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm transition-all group-hover:border-blue-200 group-hover:shadow-md"
                              >
                                <div className="grid grid-cols-1 gap-2">
                                  {Object.entries(value).map(([key, val]) => {
                                    const isBase64Image =
                                      typeof val === "string" &&
                                      val.startsWith("data:image/") &&
                                      val.includes("base64");

                                    return (
                                      <div key={key} className="text-sm">
                                        <span className="font-semibold text-gray-900">
                                          {key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                          :
                                        </span>{" "}
                                        {isBase64Image ? (
                                          <motion.img
                                            src={val}
                                            alt={key}
                                            whileHover={{ scale: 1.1 }}
                                            className="mt-1 h-16 w-auto rounded border border-gray-300 shadow-sm transition-transform"
                                          />
                                        ) : (
                                          <span className="text-gray-800">
                                            {String(val)}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={header}
                            className="px-6 py-4 text-sm text-gray-800"
                          >
                            {typeof value === "string" &&
                            /^\d{4}-\d{2}-\d{2}T/.test(value)
                              ? new Date(value).toISOString().split("T")[0] // Format the date
                              : value || "-"}{" "}
                            {/* Show formatted date or fallback "-" */}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredData.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan={headers.length + 1}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-lg">No employees found</p>
                        <p className="mt-2 text-sm">
                          Try adjusting your search or add a new employee
                        </p>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
};

export default EmployeeManagement;
