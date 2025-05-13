"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  FileText,
  Truck,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Row {
  paymentMode?: string;
  debit?: string;
  credit?: string;
}

const FormPage: React.FC = () => {
  const [Data, setData] = useState<any[]>([]);
  const [selectedBilty, setSelectedBilty] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [rows, setRows] = useState<Row[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });

  const addRow = () => {
    setRows([...rows, {}]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data/billCreation.json");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  const selectBuilty = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedBilty((prevSelectedData) => {
      if (prevSelectedData.some((selected) => selected.id === id)) {
        return prevSelectedData.filter((bilty) => bilty.id !== id);
      } else {
        const selectedBilty = Data.find((bilty) => bilty.id === id);
        return [...prevSelectedData, selectedBilty];
      }
    });
  };

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

    let debitTotal = 0;
    let creditTotal = 0;

    updatedRows.forEach((row) => {
      if (row.debit) debitTotal += parseFloat(row.debit) || 0;
      if (row.credit) creditTotal += parseFloat(row.credit) || 0;
    });

    setTotals({ debit: debitTotal, credit: creditTotal });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header with Progress Indicator */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center text-2xl font-bold">
              <FileText className="mr-3" /> Billing Form
            </h1>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center ${selectedBilty.length > 0 ? "text-white" : "text-blue-300"}`}
              >
                <Truck className="mr-2" />
                <span>Select Bilty</span>
              </div>
              <ChevronDown className="text-blue-300" />
              <div
                className={`flex items-center ${selectedType ? "text-white" : "text-blue-300"}`}
              >
                <CheckCircle2 className="mr-2" />
                <span>Bill Type</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bilty Selection Section */}
        <div className="p-6">
          <div className="mb-6 flex flex-col items-center text-center">
            <button
              onClick={selectBuilty}
              className="flex items-center rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Truck className="mr-3" />
              Select The Bilty
            </button>

            {isOpen && (
              <div className="mt-4 max-h-[35vh] w-full max-w-md overflow-y-auto rounded-lg bg-blue-50 p-4 shadow-inner">
                {Data.map((bilty) => (
                  <div
                    key={bilty.id}
                    className="mb-3 flex items-center space-x-3 rounded-md p-2 transition hover:bg-blue-100"
                  >
                    <input
                      type="checkbox"
                      id={`bilty-${bilty.id}`}
                      checked={selectedBilty.some(
                        (selected) => selected.id === bilty.id,
                      )}
                      onChange={() => handleCheckboxChange(bilty.id)}
                      className="h-5 w-5 rounded-md text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`bilty-${bilty.id}`}
                      className="flex-grow font-medium text-gray-700"
                    >
                      {bilty.biltyNo}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bill Type Selection */}
          {selectedBilty.length > 0 && (
            <div className="mb-6 rounded-lg bg-blue-50 p-4 shadow-sm">
              <p className="mb-3 flex items-center text-sm font-semibold text-blue-800">
                <RefreshCcw className="mr-2" /> Select Bill Type
              </p>
              <div className="flex justify-center space-x-6">
                {["RCM", "FCM"].map((label) => (
                  <label
                    key={label}
                    className={`flex cursor-pointer items-center rounded-lg p-3 transition ${
                      selectedType === label
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="billType"
                      value={label}
                      checked={selectedType === label}
                      onChange={() => setSelectedType(label)}
                      className="hidden"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedType && (
          <div className="min-h-screen w-[85vw] rounded-lg border  border-gray-200 bg-white shadow-lg xl:w-[65vw]">
            {/* Header Section */}
            <div className="flex  items-center  justify-between overflow-x-auto rounded-t-lg border-b border-gray-200 bg-blue-50 p-6">
              <div className="flex items-center">
                <Image
                  className="rounded-md"
                  width={200}
                  height={100}
                  src={"/images/logo/sanatan-logo.png"}
                  alt="Logo"
                  priority
                />
              </div>
              <div className="flex-1 px-6 text-center">
                <h1 className="text-2xl font-semibold uppercase text-blue-700">
                  Sanatan Express India Pvt. Ltd.
                </h1>
                <p className="text-xs text-gray-600">
                  PAN No: ABKCS2779J | GSTIN: 23ABKCS2779J1ZV
                </p>
                <p className="text-xs text-gray-600">
                  Shop No 10, 1st Floor, Plot No 888, Loha Mandi, Dewas Naka,
                  Indore 452010
                </p>
                <p className="text-xs text-gray-600">
                  Mobile: 9782760844 | Email: proprie@sanatanexpress.in
                </p>
              </div>
              <div className="flex-1 px-6 text-center">
                <h1 className="text-2xl font-semibold uppercase text-blue-700">
                  PIRAMAL PHARMA LTD.
                </h1>
                <p className="text-xs text-gray-600">
                  PAN No: ABKCS2779J | GSTIN: 23ABKCS2779J1ZV
                </p>
                <p className="text-xs text-gray-600">
                  Shop No 10, 1st Floor, Plot No 888, Loha Mandi, Dewas Naka,
                  Indore 452010
                </p>
                <p className="text-xs text-gray-600">
                  Mobile: 9782760844 | Email: proprie@sanatanexpress.in
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="space-y-8  overflow-x-auto p-6 text-sm">
              {/* Bilty Details Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <table className="w-full border-collapse text-sm text-gray-800">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="p-4">S No</th>
                      <th className="p-4">Bilty No</th>
                      <th className="p-4">Bilty Date</th>
                      <th className="p-4">From</th>
                      <th className="p-4">To</th>
                      <th className="p-4">Vehicle No</th>
                      <th className="p-4">Material</th>
                      <th className="p-4">No Of Packages</th>
                      <th className="p-4">CFT</th>
                      <th className="p-4">Charget WT(MT)</th>
                      <th className="p-4">Freight Amount</th>
                      <th className="p-4">Halting Charges</th>
                      <th className="p-4">Unloading Charges</th>
                      <th className="p-4">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBilty.map((bilty) => (
                      <tr
                        key={bilty.id}
                        className="transition duration-200 hover:bg-gray-50"
                      >
                        <td className="p-4">{bilty.id}</td>
                        <td className="p-4">{bilty.biltyNo}</td>
                        <td className="p-4">{bilty.biltyDate}</td>
                        <td className="p-4">{bilty.from}</td>
                        <td className="p-4">{bilty.to}</td>
                        <td className="p-4">{bilty.vehicleNo}</td>
                        <td className="p-4">{bilty.material}</td>
                        <td className="p-4">{bilty.noOfPackages}</td>
                        <td className="p-4">{bilty.cft}</td>
                        <td className="p-4">{bilty.chargeWt}</td>
                        <td className="p-4">{bilty.freightAmount}</td>
                        <td className="p-4">{bilty.haltingCharges}</td>
                        <td className="p-4">{bilty.unloadingCharges}</td>
                        <td className="p-4">{bilty.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* RCM/FCM Details */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="col-span-2 overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  {selectedType === "RCM" ? (
                    <table className="w-full border-collapse text-sm">
                      <tbody>
                        {[
                          ["Reporting Date"],
                          ["Unloading Date"],
                          ["Payment Terms :- 15 Days"],
                          ["GST 5%(IGST)"],
                          ["GST 5%(IGST)"],
                          ["Person Liable For Paying GST"],
                        ].map(([label], index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="px-3 py-2 font-medium text-gray-700">
                              {label}
                            </td>
                            {label !== "Payment Terms :- 15 Days" && (
                              <td className="border-r border-gray-200 px-3 py-2 text-center font-semibold">
                                <input
                                  type="text"
                                  className="w-full rounded border border-gray-200 pr-20 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full border-collapse text-sm">
                      <tbody>
                        {[
                          ["Total Billing Amount"],
                          ["CGST 6%(CGST)"],
                          ["SGST 6%(SGST)"],
                          ["IGST 5%(IGST)"],
                          ["Grand Total Amount with GST"],
                        ].map(([label], index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="px-3 py-2 font-medium text-gray-700">
                              {label}
                            </td>
                            {label !== "Payment Terms :- 15 Days" && (
                              <td className="border-r border-gray-200 px-3 py-2 text-center font-semibold">
                                <input
                                  type="text"
                                  className="w-full rounded border border-gray-200 pr-20 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Total Amount Section */}
              <div className="  rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className=" Flex mb-4">
                  <div className="text-sm font-medium text-gray-700">
                    Total Amount (In Figures)
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    1000
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Total Amount (In Words)
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    Thousand Rupees
                  </div>
                </div>
              </div>

              <div className="w-[85vw] xl:w-[60vw]">
                <div className="flex justify-between overflow-x-auto rounded-t-lg border-b border-gray-200 bg-blue-50 p-6 ">
                  <div className="flex-1   px-6 ">
                    <h1 className="text-2xl font-semibold uppercase text-blue-700">
                      Sanatan Express India Pvt. Ltd.
                    </h1>
                    <p className="text-xs text-gray-600">
                      Bank Name: ICICI BANK LTD
                    </p>
                    <p className="text-xs text-gray-600">
                      Account Number: 384805000870
                    </p>
                    <p className="text-xs text-gray-600">
                      IFSC Code: ICIC0003848
                    </p>
                    <p className="text-xs text-gray-600">
                      PAN No: ABKCS2779J | GSTIN: 23ABKCS2779J1ZV
                    </p>
                  </div>
                  <div className="flex-1 px-6 text-center">
                    <h1 className="text-2xl font-semibold uppercase text-blue-700">
                      FOR Sanatan Express India Pvt. Ltd.
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remaining form content would follow similar design principles */}
        {selectedType && (
          <div className="p-6">
            {/* Rest of the existing form content with similar refined styling */}
            <div className="text-center">
              <button className="mx-auto flex items-center rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700">
                <CheckCircle2 className="mr-2" /> Submit Challan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPage;
