"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  fetchChallanForm,
  createChallanForm,
  updateChallanForm,
  deleteChallanForm,
} from "@/lib/api/challanForm";
import {
  fetchBiltyEntry,
  createBiltyEntry,
  updateBiltyEntry,
  deleteBiltyEntry,
} from "@/lib/api/builtyEntry";
import { fetchOrders } from "@/lib/api/orderForm";
import { fetchConsignees } from "@/lib/api/consignee";
interface Bilty {
  id?: string;
  billtyNumber?: string;
  branchName?: string;
  vehicleNo?: string;
  fromStation?: string;
  toStation?: string;
  biltyDate?: string;
  natureOfGoods?: string;
  weight?: string;
  packageDetails?: any[];
  shipmentDetails?: {
    expDelDate?: string;
  };
}

const ChallanForm: React.FC = () => {
  const [data, setData] = useState<Bilty[]>([]);
  const [branchData, setBranchData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const headers =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => !["_id", "__v"].includes(key))
      : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [biltyResponse] = await Promise.all([fetchBiltyEntry()]);

        const biltyData = await biltyResponse.json();

        setData(biltyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (billtyNumber: any) => {
    setSelectedData((prevSelectedData) => {
      // Check if the bilty is already selected
      if (prevSelectedData.some((item) => item.billtyNumber === billtyNumber)) {
        // Remove the item if already selected
        return prevSelectedData.filter(
          (item) => item.billtyNumber !== billtyNumber,
        );
      } else {
        // Find the full bilty object based on the billtyNumber
        const selectedBilty = data.find(
          (bilty) => bilty.billtyNumber === billtyNumber,
        );

        if (selectedBilty) {
          // Add the full bilty object to the selected data
          return [...prevSelectedData, selectedBilty];
        }
        return prevSelectedData;
      }
    });
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedData = [...selectedData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
    };
    setSelectedData(updatedData);
  };
  return (
    <>
      <div className="mb-6 flex flex-col items-center text-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-primary-dark rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Select the Biltys for creating Challan
        </button>

        {isOpen && (
          <div className="dark:bg-dark-bg mt-4 h-[35vw] w-full max-w-xs overflow-y-auto rounded-lg bg-white p-4 shadow-lg xl:h-[10vw]">
            {data.map((bilty) => (
              <div
                key={`bilty-checkbox-${bilty?.billtyNumber}`}
                className=" mb-3 flex items-center space-x-3 "
              >
                <input
                  type="checkbox"
                  id={`bilty-${bilty.billtyNumber}`}
                  checked={selectedData.some(
                    (selected) => selected.billtyNumber === bilty.billtyNumber,
                  )}
                  onChange={() => handleCheckboxChange(bilty.billtyNumber)}
                  className="h-5 w-5 rounded-md border-2 border-gray-300 text-primary checked:border-primary checked:bg-primary focus:ring-2 focus:ring-primary dark:border-gray-600 dark:text-secondary dark:checked:border-primary dark:checked:bg-primary dark:focus:ring-secondary"
                />

                <label
                  htmlFor={`bilty-${bilty.billtyNumber}`}
                  className="font-medium text-black "
                >
                  {bilty.billtyNumber}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedData.length > 0 ? (
        <div className="flex min-h-screen w-[92vw] items-center justify-center bg-gray-50 p-6 xl:w-[75vw]">
          <div className="font-sans overflow-x-auto rounded-lg border border-gray-300 bg-white text-gray-800 shadow-lg">
            {/* Header Section */}
            <div className="flex items-center justify-between rounded-t-lg border-b border-gray-300 bg-blue-50 p-6">
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
            </div>

            {/* Form Body */}
            <div className="space-y-8 p-6 text-sm">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* First Section */}
                {/* Second Section */}
                <div className="rounded-lg border border-gray-300 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                  <div className="mb-4 text-center">
                    <label className="text-xl font-semibold text-blue-700">
                      Copy
                    </label>
                    <div className="my-4 border-b-2 border-gray-300"></div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">
                        Branch:
                      </label>
                      <select className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled selected>
                          Select Branch
                        </option>
                        {branchData.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.branchName}
                          </option>
                        ))}
                      </select>
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
                      <div
                        key={`bilty-checkbox-${bilty?.billtyNumber}`}
                        className="flex  space-y-4"
                      >
                        <div className="  mt-2   text-gray-700">
                          <label className="font-semibold">
                            {bilty?.billtyNumber} Vehicle No:
                          </label>
                          {bilty?.vehicleNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {selectedData.map((bilty, index) => (
                <div
                  key={`bilty-checkbox-${bilty?.billtyNumber}`}
                  className="flex flex-col gap-6 sm:flex-row"
                >
                  <div className="flex flex-col sm:w-1/2">
                    <label className="font-semibold text-gray-700">
                      Loading Stn:
                    </label>
                    <input
                      type="text"
                      value={bilty ? bilty?.fromStation : ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "transportDetails.from",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Loading Station"
                    />
                  </div>

                  <div className="flex flex-col sm:w-1/2">
                    <label className="font-semibold text-gray-700">
                      Delivery Stn:
                    </label>
                    <input
                      type="text"
                      value={bilty ? bilty?.toStation : ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "transportDetails.to",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Delivery Station"
                    />
                  </div>
                </div>
              ))}
              <div className="mb-6 overflow-x-auto border-b border-gray-300 pb-6 text-center">
                <table className="w-full border-collapse text-sm text-gray-800">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="p-4">Bilty No</th>
                      <th className="p-4">Bilty Date</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Nature Of Goods</th>
                      <th className="p-4">No Of Packages</th>
                      <th className="p-4">Desp. Weight</th>
                      <th className="p-4">Exp. Del. Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedData.map((bilty) => (
                      <tr
                        key={`bilty-checkbox-${bilty?.billtyNumber}`}
                        className="transition duration-200 hover:bg-gray-50"
                      >
                        <td className="p-4">{bilty?.billtyNumber}</td>
                        <td className="p-4">{bilty?.biltyDate}</td>
                        <td className="p-4">{bilty?.toStation}</td>
                        <td className="p-4">{bilty?.natureOfGoods}</td>
                        <td className="p-4">{bilty?.packageDetails?.length}</td>
                        <td className="p-4">
                          <input
                            type="text"
                            className="w-1/2 items-center justify-center rounded border  border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            className="w-1/2 rounded border border-gray-200  text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mb-6 space-y-6">
                {/* Freight and Charges Section */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="col-span-2 overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <table className="w-full border-collapse text-sm">
                      <tbody>
                        {[
                          ["Lorry Hire", "Charge Wt:"],
                          [
                            "(+) Loading Labour",
                            "Total Amount on which TDS deducted",
                          ],
                          [
                            "(+) Loading Detention",
                            "Late Delivery Penalty Per Day:",
                          ],
                          [
                            "(+) Other Charge",
                            "Late Receiving Submission Penalty Per Day:",
                          ],
                          ["( ) Total Freight", "EXP. POD Submit Date:"],
                          ["(-) TDS (@)", ""],
                          ["( - ) PLI", "Delivery Branch:"],
                          ["( - ) Loading Labour", "Phone:"],
                          ["( ) Other Charge", ""],
                          ["(-) Advance (A)", "Penalty Per Day:"],
                          ["(=) Balance", ""],
                        ].map(([label, rightLabel], index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="px-3 py-2 font-medium text-gray-700">
                              {label}
                            </td>
                            <td className="border-r border-gray-200 px-3 py-2">
                              <input
                                type="text"
                                className="w-full rounded border border-gray-200 pr-20 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              />
                            </td>
                            {rightLabel && (
                              <>
                                <td
                                  className="px-3 py-2 font-medium text-gray-700"
                                  colSpan={2}
                                >
                                  {rightLabel}
                                </td>
                                <td className="border-r border-gray-200 px-3 py-2">
                                  <input
                                    type="text"
                                    className="w-full rounded border border-gray-200 pr-20 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Details Sections */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Truck Supplier Details */}
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-800">
                      Truck Supplier Details:
                    </p>
                    <div className="space-y-3">
                      {["Name", "Slip No./Date", "Phone"].map(
                        (label, index) => (
                          <div key={index}>
                            <p className="mb-1 text-xs font-medium text-gray-600">
                              {label}
                            </p>
                            <input
                              type="text"
                              className="w-full rounded border border-gray-200 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Lorry Driver Details */}
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-800">
                      Lorry Driver Details:
                    </p>
                    <div className="space-y-3">
                      {["Name", "Phone", "License No.", "Expiry Date"].map(
                        (label, index) => (
                          <div key={index}>
                            <p className="mb-1 text-xs font-medium text-gray-600">
                              {label}
                            </p>
                            <input
                              type="text"
                              className="w-full rounded border border-gray-200 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Current Lorry Owner Details */}
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-800">
                      Current Lorry Owner Details:
                    </p>
                    <div className="space-y-3">
                      {[
                        "Name",
                        "Address",
                        "City",
                        "State",
                        "PIN",
                        "Phone",
                        "PAN",
                      ].map((label, index) => (
                        <div key={index}>
                          <p className="mb-1 text-xs font-medium text-gray-600">
                            {label}
                          </p>
                          <input
                            type="text"
                            className="w-full rounded border border-gray-200 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      ))}
                      <p className="mt-4 text-xs text-gray-500">
                        If TDS Certificate is to be issued to the lorry owner,
                        the above-mentioned address will be used.
                      </p>
                    </div>
                  </div>

                  {/* Sanatan Loading Supervisor Details */}
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-800">
                      Sanatan Loading Supervisor Details:
                    </p>
                    <div className="space-y-3">
                      {["Name", "Employee Code", "Signature"].map(
                        (label, index) => (
                          <div key={index}>
                            <p className="mb-1 text-xs font-medium text-gray-600">
                              {label}
                            </p>
                            <input
                              type="text"
                              className="w-full rounded border border-gray-200 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>
                        ),
                      )}
                      {/* Advance Transferred In */}
                      <div className=" rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="mb-3 text-sm font-semibold text-gray-800">
                          Advance Transferred In:
                        </p>
                        <div className="space-y-3">
                          {["Owner's Account", "Driver's Account"].map(
                            (label, index) => (
                              <div key={index} className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                                />
                                <p className="ml-2 text-xs font-medium text-gray-600">
                                  {label}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="mt-8 rounded-lg bg-gray-100 p-6 shadow-md">
                <div className="flex flex-col space-y-6 text-sm sm:flex-row sm:justify-between sm:space-y-0">
                  <div className="flex flex-col sm:w-1/3">
                    <label className="font-semibold text-gray-700">
                      Invoice Number:
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>

                  <div className="flex flex-col sm:w-1/3">
                    <label className="font-semibold text-gray-700">
                      Value:
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Goods consigned in the name of the consignee mentioned in the
                  receipt. Subject to Indore jurisdiction only.
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Signature of the Loading Supervisor:
                </p>
              </div>
              <div className="mt-8 items-center text-center">
                <button className="rounded-md bg-blue-600 px-6 py-3 text-lg text-white shadow-md hover:bg-blue-700 focus:outline-none">
                  Submit Challan
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Select Bilty(s) to view details.
        </div>
      )}
    </>
  );
};

export default ChallanForm;
