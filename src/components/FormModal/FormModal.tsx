import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaPlus, FaUpload, FaTimes, FaSmile, FaCar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Type {
  id: string;
  name: string;
}

interface TyreDetail {
  BillNo: string;
  BillDate: string;
  DealerName: string;
  rate: string;
  Makers: string;
  warranty: string;
  TyreNo: string;
  TyreModel: string;
  TyreType: string;
  FrontRear: string;
  FittedOnDate: string;
  removedOnDate: string;
  StartKm: number;
  EndKm: number;
}

interface Field {
  id: string;
  name: string;
  placeholder: string;
  type: string;
  value: string | number | boolean | File | File[];
  required?: boolean;
}

interface FormModalProps {
  title: string;
  onClose: () => void;
  fields: Field[];
  onSubmit: (formData: { [key: string]: any }) => void;
}

const FormModal = ({ onClose, fields, title, onSubmit }: FormModalProps) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.id]: field.value || "" }),
      {},
    ),
  );
  const [tyreDetails, setTyreDetails] = useState<TyreDetail[]>([]);
  const [fileData, setFileData] = useState<{
    [key: string]: { file: File | null; preview: string | null };
  }>({});

  const [vehicleBodyTypes, setVehicleBodyTypes] = useState<Type[]>([]);

  const [Station, setStation] = useState<Type[]>([]);

  const [showTyreForm, setShowTyreForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleUploadClick = (fieldId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = fieldId.toLowerCase().includes("image") ? "image/*" : "*/*";

    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target?.files?.[0]) {
        const file = target.files[0];
        setFormData((prev) => ({ ...prev, [fieldId]: file }));
        const previewUrl = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null;
        setFileData((prev) => ({
          ...prev,
          [fieldId]: { file, preview: previewUrl },
        }));
      }
    };
    input.click();
  };

  const capitalizeWords = (str: string) => {
    if (!str) return str;
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const fetchVehicleBodyTypes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/vehicleType.json");
        if (!response.ok) throw new Error("Failed to fetch vehicle types");
        const data = await response.json();
        setVehicleBodyTypes(data);
      } catch (error) {
        console.error("Error loading vehicle types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleBodyTypes();
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/station.json");
        if (!response.ok) throw new Error("Failed to fetch station types");
        const data = await response.json();
        setStation(data);
      } catch (error) {
        console.error("Error loading vehicle types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldId: string,
    tyreIndex?: number,
  ) => {
    const { name, value } = e.target;
    if (tyreIndex !== undefined) {
      setTyreDetails((prev) =>
        prev.map((tyre, idx) =>
          idx === tyreIndex ? { ...tyre, [name]: value } : tyre,
        ),
      );
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, tyreDetails });
  };

  const addTyreDetail = () => {
    const newTyreDetail: TyreDetail = {
      BillNo: "",
      BillDate: "",
      DealerName: "",
      rate: "",
      Makers: "",
      warranty: "",
      TyreNo: "",
      TyreModel: "",
      TyreType: "",
      FrontRear: "",
      FittedOnDate: "",
      removedOnDate: "",
      StartKm: 0,
      EndKm: 0,
    };
    setTyreDetails((prev) => [...prev, newTyreDetail]);
    setShowTyreForm(true);
  };

  const removeTyreDetail = (index: number) => {
    setTyreDetails((prev) => prev.filter((_, idx) => idx !== index));
  };

  const renderFileUploadField = (field: Field) => {
    const fileInfo = fileData[field.id];
    const isImage = field.id.toLowerCase().includes("image");

    return (
      <div className="space-y-2 overflow-x-auto">
        <label className="block text-sm font-medium text-gray-700">
          {capitalizeWords(field.name)}
        </label>
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => handleUploadClick(field.id)}
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaUpload className="h-4 w-4" />
            <span>Upload {isImage ? "Image" : "File"}</span>
          </button>
        </div>
        {fileInfo?.preview && isImage && (
          <div className="mt-2 flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200">
              <Image
                width={128}
                height={128}
                src={fileInfo.preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(fileInfo.preview!);
                  setFileData((prev) => ({
                    ...prev,
                    [field.id]: { file: null, preview: null },
                  }));
                }}
                className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
              >
                <FaTimes className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderField = (field: Field) => {
    if (field.type === "file") {
      return renderFileUploadField(field);
    }

    if (field.name === "Vehicle.BodyType" || field.name === "vehicleType") {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {capitalizeWords(field.placeholder)}
          </label>
          <select
            id={field.id}
            name={field.name}
            value={formData[field.id] || ""}
            onChange={(e: any) => handleInputChange(e, field.id)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
            disabled={isLoading}
          >
            <option value="">Select Vehicle Body Type</option>
            {vehicleBodyTypes.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {isLoading && (
            <p className="mt-1 text-sm text-gray-500">
              Loading vehicle types...
            </p>
          )}
        </div>
      );
    }

    if (field.name === "toStation" || field.name === "fromStation") {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {capitalizeWords(field.placeholder)}
          </label>
          <select
            id={field.id}
            name={field.name}
            value={formData[field.id] || ""}
            onChange={(e: any) => handleInputChange(e, field.id)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
            disabled={isLoading}
          >
            <option value="">Select Station</option>
            {Station.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {isLoading && (
            <p className="mt-1 text-sm text-gray-500">
              Loading Station types...
            </p>
          )}
        </div>
      );
    }

    if (field.name === "vehicleRequired") {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {capitalizeWords(field.placeholder)}
          </label>
          <select
            id={field.id}
            name={field.name}
            value={formData[field.id] || ""}
            onChange={(e: any) => handleInputChange(e, field.id)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
            disabled={isLoading}
          >
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
          {isLoading && (
            <p className="mt-1 text-sm text-gray-500">
              Loading Station types...
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {capitalizeWords(field.placeholder)}
        </label>
        <input
          type={field.type}
          id={field.id}
          name={field.name}
          value={formData[field.id] || ""}
          onChange={(e) => handleInputChange(e, field.id)}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
    );
  };

  const categorizeFields = () => {
    return fields.reduce(
      (acc, field) => {
        const category = field.id.split(".")[0];
        return {
          ...acc,
          [category]: [...(acc[category] || []), field],
        };
      },
      {} as { [key: string]: Field[] },
    );
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const tyreCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50  flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative max-h-[70vh] w-1-2 overflow-y-auto rounded-xl bg-white shadow-2xl sm:max-w-xl md:max-w-2xl lg:max-w-4xl"
        >
          {/* Header */}
          <div className="sticky top-4 z-10 border-b border-gray-200 bg-white px-4 py-4 pt-10 sm:px-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
            >
              <FaTimes className="mt-4 h-8 w-8" />
            </motion.button>
            <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
              {title}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex-1 space-y-6 p-4 sm:p-6">
              {/* Categorized Fields */}
              {Object.entries(categorizeFields()).map(
                ([category, categoryFields], index) => (
                  <motion.div
                    key={category}
                    variants={categoryVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:p-6"
                  >
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 sm:mb-6 sm:text-xl">
                      {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                      Details
                    </h3>
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                      {categoryFields.map((field: Field) => (
                        <motion.div
                          key={field.id}
                          whileHover={{ scale: 1.02 }}
                          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                        >
                          {renderField(field)}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ),
              )}

              {/* Tyre Form */}
              <AnimatePresence>
                {showTyreForm && tyreDetails.length > 0 && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={categoryVariants}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:p-6"
                  >
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 sm:mb-6 sm:text-xl">
                      <FaSmile className="h-5 w-5 text-green-500" />
                      Tyre Details
                    </h3>

                    <div className="space-y-4 sm:space-y-6">
                      <AnimatePresence>
                        {tyreDetails.map((tyre, index) => (
                          <motion.div
                            key={index}
                            variants={tyreCardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="relative rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-all hover:shadow-lg sm:p-6"
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeTyreDetail(index)}
                              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-2 text-white shadow-lg transition-colors hover:bg-red-600"
                            >
                              <FaTimes className="h-4 w-4" />
                            </motion.button>
                            <div className="grid gap-4 sm:grid-cols-2">
                              {Object.entries(tyre).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </label>
                                  <input
                                    type="text"
                                    id={`tyre-${index}-${key}`}
                                    name={key}
                                    value={value}
                                    onChange={(e) =>
                                      handleInputChange(e, key, index)
                                    }
                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:px-4 sm:py-2.5"
                                  />
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add Tyre Button */}
              <div className="flex justify-center">
                {fields.find((field: any) =>
                  field.name.toLowerCase().includes("tyre"),
                ) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addTyreDetail}
                    className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
                  >
                    <FaCar className="h-4 w-4" />
                    <span className="font-medium">Add Tyre</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="sticky bottom-0 mt-4 flex gap-4 border-t border-gray-200 bg-white p-4 sm:mt-6 sm:p-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-6 sm:py-3"
              >
                Submit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:px-6 sm:py-3"
              >
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FormModal;
