"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Row {
  paymentMode?: string;
  debit?: string;
  credit?: string;
}

const FormPage: React.FC = () => {
  const [Data, setData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any[]>([]); // Array to store selected bilties
  const [rows, setRows] = useState<Row[]>([{}]); // Explicit type for rows
  const [isOpen, setIsOpen] = useState(false);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 }); // State to track totals

  // Handle adding a new row
  const addRow = () => {
    setRows([...rows, {}]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data/moneyReceipt.json");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  const selectbillty = () => {
    setIsOpen(!isOpen);
  };

  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    setSelectedData((prevSelectedData) => {
      if (prevSelectedData.some((selected) => selected.id === id)) {
        return prevSelectedData.filter((billty) => billty.id !== id); // Remove if already selected
      } else {
        const selectedbillty = Data.find((billty) => billty.id === id);
        return [...prevSelectedData, selectedbillty]; // Add if not selected
      }
    });
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
    <>
      <div className="mb-6 flex flex-col items-center text-center">
        <button
          onClick={selectbillty}
          className="hover:bg-primary-dark rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Select the bill creationVoucher for Money receipt
        </button>

        {isOpen && (
          <div className="dark:bg-dark-bg mt-4 h-[35vw] w-full max-w-xs overflow-y-auto rounded-lg bg-white p-4 shadow-lg xl:h-[10vw]">
            {Data.map((billty) => (
              <div
                key={billty.id}
                className=" mb-3 flex items-center space-x-3 "
              >
                <input
                  type="checkbox"
                  id={`billty-${billty.id}`}
                  checked={selectedData.some(
                    (selected) => selected.id === billty.id,
                  )}
                  onChange={() => handleCheckboxChange(billty.id)}
                  className="h-5 w-5 rounded-md text-primary focus:ring-2 focus:ring-primary dark:text-secondary dark:focus:ring-secondary"
                />
                <label
                  htmlFor={`billty-${billty.id}`}
                  className="font-medium text-black "
                >
                  {billty.billtyNo}
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
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"></div>

              <div className=" w-[85vw]  max-w-7xl overflow-hidden rounded-lg bg-white shadow-lg">
                {/* Top Table Section */}
                <div className="overflow-x-auto p-6">
                  <table className="min-w-full table-auto border-collapse border border-gray-300 text-center">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-3 text-sm text-gray-700">No.</th>
                        <th className="p-3 text-sm text-gray-700">Bill No</th>
                        <th className="p-3 text-sm text-gray-700">Bill Date</th>
                        <th className="p-3 text-sm text-gray-700">
                          Customer Name
                        </th>
                        <th className="p-3 text-sm text-gray-700">
                          Frieght Amount
                        </th>
                        <th className="p-3 text-sm text-gray-700">CGST 6%</th>
                        <th className="p-3 text-sm text-gray-700">SGST 6%</th>
                        <th className="p-3 text-sm text-gray-700">IGST 12%</th>
                        <th className="p-3 text-sm text-gray-700">
                          Total Freight
                        </th>
                        <th className="p-3 text-sm text-gray-700">
                          On Account Payment
                        </th>
                        <th className="p-3 text-sm text-gray-700">
                          Damage/Claim Deduct
                        </th>
                        <th className="p-3 text-sm text-gray-700">TDS</th>
                        <th className="p-3 text-sm text-gray-700">
                          Final Received
                        </th>
                        <th className="p-3 text-sm text-gray-700">
                          {" "}
                          Received Date
                        </th>
                        <th className="p-3 text-sm text-gray-700"> Remarks</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white">
                      {selectedData.map((billty, rowIndex) => (
                        <tr
                          key={billty.id}
                          className="transition duration-200 hover:bg-gray-50"
                        >
                          <td className="p-4">{billty.id}</td>
                          <td className="p-4">{billty.billtyNo}</td>
                          <td className="p-4">{billty.billtyDate}</td>
                          <td className="p-4">{billty.customerName}</td>
                          <td className="p-4">{billty.freightAmount}</td>
                          <td className="p-4">{billty.cgst}</td>
                          <td className="p-4">{billty.sgst}</td>
                          <td className="p-4">{billty.igst}</td>
                          <td className="p-4">{billty.totalFreight}</td>
                          <td className="p-4">{billty.onAccountPayment}</td>
                          <td className="p-4">{billty.damageClaimDeduct}</td>
                          <td className="p-4">{billty.tds}</td>
                          <td className="p-4">{billty.finalReceived}</td>
                          <td className="p-4">{billty.receivedDate}</td>
                          <td className="p-4">{billty.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Table Section */}
              <div className="mt-4 w-full max-w-7xl rounded-lg bg-white p-4 shadow-lg">
                <div className="overflow-x-auto text-center ">
                  <div className="flex items-center gap-4 text-center font-semibold">
                    <p>Final Receive Amount :</p>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 text-center text-sm"
                      placeholder=""
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-center font-semibold">
                    <p>Final Receive Amount in words :</p>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 text-center text-sm"
                      placeholder=""
                    />
                  </div>
                  <table className="mt-4 min-w-full table-auto border-collapse border border-gray-300 text-center">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-3 text-sm text-gray-700">
                          Checked By
                        </th>
                        <th className="p-3 text-sm text-gray-700">
                          Account Head
                        </th>
                        <th className="p-3 text-sm text-gray-700">
                          Authorized Sign
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>

              {/* Submit Button (optional) */}
              <div className="mt-8 items-center text-center">
                <button className="rounded-md bg-blue-600 px-6 py-3 text-lg text-white shadow-md hover:bg-blue-700 focus:outline-none">
                  Submit Chalan
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="item-center text-center font-semibold text-gray-500">
          Select billty(s) to view details.
        </div>
      )}
    </>
  );
};

export default FormPage;
