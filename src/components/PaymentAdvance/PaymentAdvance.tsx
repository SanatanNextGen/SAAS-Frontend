"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchPaymentAdvance,
  createPaymentAdvance,
  updatePaymentAdvance,
  deletePaymentAdvance,
} from "@/lib/api/paymentAdvance";
import { fetchChallanForm } from "@/lib/api/challanForm";
interface Row {
  paymentMode?: string;
  debit?: string;
  credit?: string;
}

const FormPage: React.FC = () => {
  const [Data, setData] = useState<any[]>([]);
  const [challanData, setChallanData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any[]>([]); // Array to store selected bilties
  const [rows, setRows] = useState<Row[]>([{}]); // Explicit type for rows
  const [isOpen, setIsOpen] = useState(false);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 }); // State to track totals
  const [ConsignorData, setConsignorData] = useState<any[]>([]);
  const [SelectedConsignor, setSelectedConsignor] = useState<any>();

  // Handle adding a new row
  const addRow = () => {
    setRows([...rows, {}]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [biltyResponse] = await Promise.all([fetchChallanForm()]);

        const data = await biltyResponse.json();

        setChallanData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPaymentAdvance();
      setData(response);
    };

    fetchData();
  }, []);

  const selectbilty = () => {
    setIsOpen(!isOpen);
  };

  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    setSelectedData((prevSelectedData) => {
      if (prevSelectedData.some((selected) => selected.id === id)) {
        return prevSelectedData.filter((bilty) => bilty.id !== id); // Remove if already selected
      } else {
        const selectedbilty = Data.find((bilty) => bilty.id === id);
        return [...prevSelectedData, selectedbilty]; // Add if not selected
      }
    });
  };

  const handleConsignorChange = (e: any) => {
    const selectedId = e.target.value;
    const selectedConsignorData = ConsignorData.find(
      (consignor) => consignor.id === parseInt(selectedId),
    );
    setSelectedConsignor(selectedConsignorData);
  };

  // Handle input changes for selected data
  const handleInputChange = (
    index: number,
    field: string,
    value: string,
    type: "debit" | "credit",
  ) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value,
    };

    setRows(updatedRows);

    // Update the totals
    let debitTotal = 0;
    let creditTotal = 0;

    updatedRows.forEach((row) => {
      if (row.debit) debitTotal += parseFloat(row.debit) || 0;
      if (row.credit) creditTotal += parseFloat(row.credit) || 0;
    });

    setTotals({ debit: debitTotal, credit: creditTotal });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center text-center"
      >
        <button
          onClick={selectbilty}
          className="group relative overflow-hidden rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="relative z-10">
            Select Challan for Advance Payment Voucher
          </span>
          <div className="absolute inset-0 -translate-x-full bg-blue-400 opacity-20 transition-transform group-hover:translate-x-0"></div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 w-full max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-xl"
            >
              <div className="space-y-3">
                {Data.map((bilty) => (
                  <motion.div
                    key={bilty.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 rounded-lg p-2 transition-colors hover:bg-blue-50"
                  >
                    <input
                      type="checkbox"
                      id={`bilty-${bilty.id}`}
                      checked={selectedData.some(
                        (selected) => selected.id === bilty.id,
                      )}
                      onChange={() => handleCheckboxChange(bilty.id)}
                      className="h-5 w-5 rounded-md text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`bilty-${bilty.id}`}
                      className="flex-1 cursor-pointer font-medium text-gray-700"
                    >
                      {bilty.biltyNo}
                    </label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-blue-100 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image
                      className="rounded-lg shadow-md transition-transform hover:scale-105"
                      width={200}
                      height={100}
                      src="/images/logo/sanatan-logo.png"
                      alt="Logo"
                      priority
                    />
                  </div>
                  <div className="flex-1 px-6 text-center">
                    <h1 className="text-3xl font-bold text-blue-800">
                      Sanatan Express India Pvt. Ltd.
                    </h1>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>PAN No: ABKCS2779J | GSTIN: 23ABKCS2779J1ZV</p>
                      <p>
                        Shop No 10, 1st Floor, Plot No 888, Loha Mandi, Dewas
                        Naka, Indore 452010
                      </p>
                      <p>
                        Mobile: 9782760844 | Email: proprie@sanatanexpress.in
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form Content */}
              <div className="space-y-8 p-6">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {/* First Section */}
                  {/* Second Section */}
                  <div className="rounded-lg border border-gray-300 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <div className="mb-4 text-center">
                      <label className="text-xl font-semibold text-blue-700">
                        BROKER / TRANSPORTER
                      </label>
                      <div className="my-4 border-b-2 border-gray-300"></div>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">
                        Select Broker/Transporter
                      </label>
                      <select
                        onChange={handleConsignorChange}
                        className="rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        {challanData.map((consignor, index) => (
                          <option key={index} value={consignor.firm.firmName}>
                            {consignor.firm.firmName}{" "}
                            {/* Adjust based on your data structure */}
                          </option>
                        ))}
                      </select>

                      <div className="mt-2 h-10 w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500">
                        Consignor GSTIN : {SelectedConsignor?.firm?.gstin || ""}
                      </div>
                    </div>
                  </div>
                  {/* Third Section */}
                  <div className="rounded-lg border border-gray-300 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <div className="mb-4">
                      <div className="flex flex-col space-y-4">
                        <label className="font-semibold text-gray-700">
                          Serial No:
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter Serial No"
                        />
                        <div className="my-4 border-b-2 border-gray-300"></div>
                      </div>

                      <div className="flex flex-col space-y-4">
                        <label className="font-semibold text-gray-700">
                          Date:
                        </label>
                        <input
                          type="date"
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="my-4 border-b-2 border-gray-300"></div>
                      </div>
                      {selectedData.map((bilty, index) => (
                        <div key={bilty.id} className="flex flex-col space-y-4">
                          <label className="font-semibold text-gray-700">
                            Vehicle No:
                          </label>
                          <input
                            type="text"
                            value={bilty ? bilty.shipmentDetails.vehicleNo : ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "shipmentDetails.vehicleNo",
                                e.target.value,
                                "debit", // Or credit, depending on the use case
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Vehicle No"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Sections */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
                  >
                    {/* Your existing form sections here */}
                  </motion.div>
                  {/* Add similar motion.div wrappers for other sections */}
                </div>

                {/* Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                >
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Challan No
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Bilty No
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Bilty Date
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Vehicle No
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Advance Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedData.map((bilty, index) => (
                        <motion.tr
                          key={bilty.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-t border-gray-200 transition-colors hover:bg-gray-50"
                        >
                          <td className="p-4">{bilty.id}</td>
                          <td className="p-4">{bilty.biltyNo}</td>
                          <td className="p-4">{bilty.biltyDate}</td>
                          <td className="p-4">
                            {bilty.shipmentDetails.vehicleNo}
                          </td>
                          <td className="p-4">
                            <input
                              className="w-full rounded-lg border border-gray-300 p-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Amount"
                            />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>

                <div className="w-full max-w-7xl rounded-lg bg-white shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300 text-center">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-3 text-sm text-gray-700">
                            Payment Mode
                          </th>
                          <th className="p-3 text-sm text-gray-700">Debit</th>
                          <th className="p-3 text-sm text-gray-700">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {rows.map((_, rowIndex) => (
                          <tr key={rowIndex}>
                            {Array.from({ length: 3 }).map((_, index) => {
                              const fieldName =
                                index === 0
                                  ? "paymentMode"
                                  : index === 1
                                    ? "debit"
                                    : "credit";

                              return (
                                <td
                                  key={index}
                                  className="relative border border-gray-300 p-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <input
                                      type="text"
                                      className="w-full rounded-md border border-gray-300 p-2 text-center text-sm"
                                      placeholder=""
                                      value={rows[rowIndex][fieldName] || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          fieldName,
                                          e.target.value,
                                          fieldName === "debit"
                                            ? "debit"
                                            : "credit",
                                        )
                                      }
                                    />
                                    {/* Display the "+" button outside the input box */}
                                    {index === 2 &&
                                      rowIndex === rows.length - 1 && (
                                        <button
                                          onClick={addRow}
                                          className="ml-2 p-2 text-3xl font-bold text-gray-600"
                                        >
                                          +
                                        </button>
                                      )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>

                      <tfoot className="bg-gray-200">
                        <tr>
                          <th className="p-3 text-sm text-gray-700">Total</th>
                          <td className="p-3">{totals.debit.toFixed(2)}</td>
                          <td className="p-3">{totals.credit.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <button className="group relative overflow-hidden rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="relative z-10">Submit Challan</span>
                    <div className="absolute inset-0 -translate-x-full bg-blue-400 opacity-20 transition-transform group-hover:translate-x-0"></div>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500"
          >
            Select bilty(s) to view details.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormPage;
