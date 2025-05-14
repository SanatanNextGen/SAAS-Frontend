"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FormModal from "../FormModal/FormModal";
import Modal from "../Modal/Modal";
import { Plus, FileDown, Edit2, Trash2, Eye ,Search} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  fetchVehicles,
  createVehicles,
  updateVehicles,
  deleteVehicles,
} from "@/lib/api/vehicle";

const ownData = {
  Owner: {
    Number: "",
    OwnerName: "",
    OwnerMobileNo: "",
    OwnerPANNo: "",
    OwnerAddress: "",
  },

  Vehicle: {
    Make: "",
    BodyType: "",
    EngineNo: "",
    ChassisNo: "",
    Model: "",
    YearOfManufacture: "",
    VehicleType: "Owned",
  },

  Fitness: {
    FitnessNo: "",
    FitnessDate: "",
    FitnessExpiryDate: "",
  },

  RoadTax: {
    StartDate: "",
    EndDate: "",
  },

  Permit: {
    PermitNo: "",
    ValidUpto: "",
  },

  FiveYearPermit: {
    PermitNo: "",
    ValidUpto: "",
  },

  Insurance: {
    PolicyNo: "",
    ValidFrom: "",
    ValidUpto: "",
  },

  PUC: {
    PUCNo: "",
    PUCFromDate: "",
    PUCToDate: "",
  },

  Documents: {
    RCDocument: "",
    FitnessDocument: "",
    RoadTaxDocument: "",
    NationalPermitDocument: "",
    FiveYearPermitDocument: "",
    InsuranceCopy: "",
    PUCDocument: "",
    DrivingLicense: "",
  },

  Battery: {
    BatteryBillNo: "",
    BatteryBillDate: "",
    BatteryDealerName: "",
    BatteryMakers: "",
    BatteryWarranty: "",
    BatteryWarrantyExpiryDate: "",
  },

  Tyre: [
    {
      TyreBillNo: "",
      TyreBillDate: "",
      TyreDealerName: "",
      TyreRate: "",
      TyreMakers: "",
      TyreWarranty: "",
      TyreNo: "",
      TyreModel: "", // "New", "Old", or "Resole"
      TyreType: "", // "New", "Old", or "Resole"
      TyreFrontRear: "", // "Front" or "Rear"
      TyreFittedOnDate: "",
      TyreRemovedOnDate: "",
      TyreStartKm: 0,
      TyreEndKm: 0, // End Km (of Previous Tyre)
    },
  ],
};

const hiredData = {
  Owner: {
    Number: "",
    OwnerName: "",
    OwnerMobileNo: "",
    OwnerPANNo: "",
    OwnerAddress: "",
  },

  Vehicle: {
    Make: "",
    BodyType: "",
    EngineNo: "",
    ChassisNo: "",
    Model: "",
    YearOfManufacture: "",
    VehicleType: "Owned",
  },

  Fitness: {
    FitnessNo: "",
    FitnessDate: "",
    FitnessExpiryDate: "",
  },

  RoadTax: {
    StartDate: "",
    EndDate: "",
  },

  Permit: {
    PermitNo: "",
    ValidUpto: "",
  },

  FiveYearPermit: {
    PermitNo: "",
    ValidUpto: "",
  },

  Insurance: {
    PolicyNo: "",
    ValidFrom: "",
    ValidUpto: "",
  },

  PUC: {
    PUCNo: "",
    PUCFromDate: "",
    PUCToDate: "",
  },

  Documents: {
    RCDocument: "",
    FitnessDocument: "",
    RoadTaxDocument: "",
    NationalPermitDocument: "",
    FiveYearPermitDocument: "",
    InsuranceCopy: "",
    PUCDocument: "",
    DrivingLicense: "",
  },
};

const defaultData = {
  BodyType: "",
};

const VehicleManagement = () => {
  const downloadCSV = () => {
    const csvRows = [];

    // Define headers for CSV
    const headers = [
      "Truck Number",
      "Make",
      "Model",
      "Year of Manufacture",
      "Permit No",
      "Permit Date",
      "Insurance No",
      "Insurance From",
      "Insurance Validity",
      "Insurance Company",
      "Insurance Charge",
      "RTO No",
      "RTO Date",
      "Fitness No",
      "Fitness Date",
      "PUC No",
      "PUC Date",
      "Vehicle Type",
      "Address",
      "Remark",
      "Driver Name",
      "Regd No",
      "Adhar Card No",
      "Truck Owner Name",
      "Truck Owner Mobile No",
      "Truck Owner PAN No",
      "DL No",
      "Insurance Copy",
      "RC Document",
      "PUC Document",
      "PAN Document",
      "TDS Document",
      "Truck Picture",
      "Permit Document",
      "Insurance Copy",
      "Road Tax Start Date",
      "Road Tax End Date",
      "Next Due",
      "Road Tax Amount",
      "Transfer To",
      "Transfer Date",
      "Bank Name",
      "Remarks",
    ];

    csvRows.push(headers.join(","));

    // Process each item in Data (assuming `Data` is an array of records)
    Data.forEach((item) => {
      const row = [
        item?.TruckNo,
        item?.Make,
        item?.Model,
        item?.YearOfManufacture,
        item?.Permit?.PermitNo,
        item?.Permit?.ValidUpto,
        item?.Insurance?.PolicyNo,
        item?.Insurance?.ValidFrom,
        item?.Insurance?.ValidUpto,
        item?.Insurance?.Company, // Assuming you have this data
        item?.Insurance?.Charge, // Assuming you have this data
        item?.RTO?.RTO_No,
        item?.RTO?.RTO_Date,
        item?.Fitness?.FitnessNo,
        item?.Fitness?.FitnessDate,
        item?.PUC?.PUCNo,
        item?.PUC?.PUCDate,
        item?.OtherDetails?.VehicleType,
        item?.OtherDetails?.Address,
        item?.OtherDetails?.Remark,
        item?.OtherDetails?.DriverName,
        item?.OtherDetails?.RegdNo,
        item?.OtherDetails?.AadharCardNo,
        item?.Owner?.OwnerName,
        item?.Owner?.OwnerMobileNo,
        item?.Owner?.OwnerPANNo,
        item?.OtherDetails?.DLNo,
        item?.Documents?.InsuranceCopy,
        item?.Documents?.RCDocument,
        item?.Documents?.PUCDocument,
        item?.Documents?.PANDocument,
        item?.Documents?.TDSDocument,
        item?.Documents?.TruckPicture,
        item?.Documents?.PermitDocument,
        item?.RoadTax?.StartDate,
        item?.RoadTax?.EndDate,
        item?.RoadTax?.NextDue,
        item?.RoadTax?.Amount, // Assuming this data exists
        item?.RoadTax?.TransferTo,
        item?.RoadTax?.TransferDate,
        item?.RoadTax?.BankName,
        item?.RoadTax?.Remarks,
      ];

      csvRows.push(row.join(","));
    });

    // Convert to CSV and trigger download
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "truck_records.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [VehicleType, setVehicleType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [Data, setData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchVehicles();
        setData(response || []);
        setFilteredData(response);

      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchData();
  }, []);

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
    try {
      // Check if it's an update or a new entry
      if (selectedData && isEditModalOpen) {
        // Make sure we're using the correct ID for the update
        const vehicleId = selectedData._id;
        
        // Ensure the ID is included in the form data
        const dataToUpdate = { ...formData, _id: vehicleId };
        
        // Update an existing vehicle
        const updated = await updateVehicles(vehicleId, dataToUpdate);
        
        // Update the local state
        setData((prev) =>
          prev.map((vehicle) => (vehicle._id === vehicleId ? updated : vehicle))
        );
        
        // Close the edit modal after update
        setIsEditModalOpen(false);
        setSelectedData(null);
      } else {
        // Create a new vehicle
        const created = await createVehicles(formData);
        setData((prev) => [...prev, created]);
        setIsModalOpen(false); // Close the add modal after creating
      }
    } catch (error) {
      console.error("Error handling vehicle data:", error);
      alert("Error processing vehicle data. Please try again.");
    }
  };

  const getDataForVehicleType = (type: string) => {
    if (type === "Own") {
      return ownData;
    } else if (type === "Hired") {
      return hiredData;
    }
    return ownData;
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

        // Don't skip _id field when updating
        if (key === "id") return;

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
        } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          processObject(value, fieldName);
        } else {
          const field = {
            id: fieldName,
            name: fieldName,
            placeholder: `Consignee ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`,
            type: getFieldType(value),
            value: value,
          };
          fieldsByKey[fieldName] = field;
        }
      });
    };

    // Process data to collect all fields
    processObject(data);

    // If this is for editing, add a hidden field for _id
    if (data._id) {
      fieldsByKey["_id"] = {
        id: "_id",
        name: "_id",
        type: "hidden",
        value: data._id,
      };
    }

    // Process default data to ensure correct order
    const processDefaultDataOrder = (obj: any, prefix: string = "") => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const fieldName = prefix ? `${prefix}.${key}` : key;

        if (key === "id") return;

        if (key === "Documents") {
          Object.entries(value).forEach(([docKey]) => {
            const fullKey = `${fieldName}.${docKey}`;
            if (fieldsByKey[fullKey]) {
              orderedFields.push(fieldsByKey[fullKey]);
              delete fieldsByKey[fullKey];
            }
          });
        } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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
    if (value instanceof Date) return "date";
    return "text";
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleOpenVehicleModal = () => {
    setIsVehicleModalOpen(true);
    setIsOpen(false);
  };

  const handleIsOpenModal = () => {
    setIsOpen(true);
  };

  const handleIsCloseModal = () => {
    setIsOpen(false);
  };

  const modalOptions = [
    {
      label: "Own Vehicle",
      onClick: () => {
        setVehicleType("Own");
        handleOpenModal();
      },
    },
    {
      label: "HiredVehicle",
      onClick: () => {
        setVehicleType("Hired");
        handleOpenModal();
      },
    },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsVehicleModalOpen(false);
    // Clear selected data when closing modals
    setSelectedData(null);
  };

  const handleEditData = (data: any) => {
    // Make sure we have a complete copy of the data object with _id
    setSelectedData({...data});
    setIsEditModalOpen(true);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updatedData = [...Data];
    updatedData[index].Documents[field] = file; // Update the corresponding field with the uploaded file
    setData(updatedData);
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

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this Vehicle?");
    if (!confirmed) return;

    try {
      const success = await deleteVehicles(id);
      if (success) {
        setData((prev) => prev.filter((vehicle) => vehicle._id !== id));
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Error deleting vehicle. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Vehicle Management
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleIsOpenModal}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Vehicle
            </button>
            <button
              onClick={handleOpenVehicleModal}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Body Type
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
            placeholder="Search consignors by name, email, phone or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </motion.div>

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
                    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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

      {/* Modals */}
      <Modal
        isOpen={isOpen}
        onClose={handleIsCloseModal}
        options={modalOptions}
        title="Select Vehicle Type"
      />

      {isModalOpen && (
        <FormModal
          title={
            VehicleType === "Own" ? "Add Own Vehicle" : "Add Hired Vehicle"
          }
          onClose={handleCloseModal}
          fields={transformToFields(getDataForVehicleType(VehicleType))}
          onSubmit={handleSubmit}
        />
      )}

      {isVehicleModalOpen && (
        <FormModal
          title="Add Vehicle Body Type"
          onClose={handleCloseModal}
          fields={transformToFields(defaultData)}
          onSubmit={handleSubmit}
        />
      )}

      {isEditModalOpen && selectedData && (
        <FormModal
          title="Edit Vehicle Details"
          onClose={handleCloseModal}
          fields={transformToFields(selectedData)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default VehicleManagement;