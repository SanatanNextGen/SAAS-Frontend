"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  fetchBiltyEntry,
  createBiltyEntry,
  updateBiltyEntry,
  deleteBiltyEntry,
} from "@/lib/api/builtyEntry";
import { fetchOrders } from "@/lib/api/orderForm";
import { fetchConsignees } from "@/lib/api/consignee";
import { fetchConsignors } from "@/lib/api/consignor";
import { fetchVehicles } from "@/lib/api/vehicle";
import { fetchStations } from "@/lib/api/station";
interface Row {
  paymentMode?: string;
  debit?: string;
  credit?: string;
}

const BilltyEntry: React.FC = () => {
  const [Data, setData] = useState<any[]>([]);
  const [StationData, setStationData] = useState<any[]>([]);
  const [OrderData, setOrderData] = useState<any[]>([]);

  const [ConsignorData, setConsignorData] = useState<any[]>([]);
  const [ConsigneeData, setConsigneeData] = useState<any[]>([]);
  const [VehicleData, setVehicleData] = useState<any[]>([]);

  const [SelectedConsignor, setSelectedConsignor] = useState<any>();
  const [SelectedConsignee, setSelectedConsignee] = useState<any>();
  const [SelectedVehicle, setSelectedVehicle] = useState<any>();
  const [withOutPo, setWithOutPo] = useState<Boolean>(false);

  const [selectedData, setSelectedData] = useState<any>();
  const [rows, setRows] = useState<Row[]>([{}]);
  const [isOpen, setIsOpen] = useState(false);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });

  const addRow = () => {
    setRows([...rows, {}]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          biltyResponse,
          orderEntryResponse,
          consigneeResponse,
          consignorResponse,
          vehicleResponse,
          stationResponse,
        ] = await Promise.all([
          fetchBiltyEntry(),
          fetchConsignees(),
          fetchConsignors(),
          fetchOrders(),
          fetchStations(),
          fetchVehicles(),
        ]);

        const biltyData = await biltyResponse.json();
        const orderEntryData = await orderEntryResponse.json();
        const consigneeData = await consigneeResponse.json();
        const consignorData = await consignorResponse.json();
        const vehicleData = await vehicleResponse.json();
        const stationData = await stationResponse.json();

        setData(biltyData);
        setOrderData(orderEntryData);
        setConsigneeData(consigneeData);
        setConsignorData(consignorData);
        setVehicleData(vehicleData);
        setStationData(stationData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const selectOrder = () => {
    setIsOpen(!isOpen);
  };

  const handleConsigneeChange = (e: any) => {
    const selectedId = e.target.value;
    const selectedConsigneeData = ConsigneeData.find(
      (consignee: any) => consignee.id === parseInt(selectedId),
    );
    setSelectedConsignee(selectedConsigneeData);
  };

  const handleConsignorChange = (e: any) => {
    const selectedId = e.target.value;
    const selectedConsignorData = ConsignorData.find(
      (consignor) => consignor.id === parseInt(selectedId),
    );
    setSelectedConsignor(selectedConsignorData);
  };

  const handleVehicleChange = (e: any) => {
    const selectedId = e.target.value;
    const selectedVehicleData = VehicleData.find(
      (vehicle) => vehicle.id === parseInt(selectedId),
    );
    setSelectedVehicle(selectedVehicleData);
  };

  const handleStationChange = (e: any) => {
    const selectedId = e.target.value;
    const selectedVehicleData = VehicleData.find(
      (vehicle) => vehicle.id === parseInt(selectedId),
    );
    setSelectedVehicle(selectedVehicleData);
  };

  const handleRadioChange = (id: string) => {
    setSelectedData((prevSelectedData: any) => {
      // Find the selected order based on the id
      const selectedOrder = OrderData.find((order) => order?.id === id);

      if (!selectedOrder) return null; // If no matching order found, return null

      // Only one order can be selected at a time, so set selectedData to the new selected order
      return selectedOrder;
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
      <div className="flex- mb-6 flex items-center justify-center gap-4 text-center">
        <button
          onClick={selectOrder}
          className="hover:bg-primary-dark rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          With PO
        </button>

        <button
          onClick={() => setWithOutPo(true)}
          className="hover:bg-primary-dark rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Without PO
        </button>

        {isOpen && (
          <div className="dark:bg-dark-bg mt-4 h-[35vw] w-full max-w-xs overflow-y-auto rounded-lg bg-white p-4 shadow-lg xl:h-[10vw]">
            {OrderData.map((order) => (
              <div key={order?.id} className="mb-3 flex items-center space-x-3">
                <input
                  type="radio"
                  id={order?.id}
                  checked={selectedData?.id === order?.id} // Direct comparison to check if this order is the selected one
                  onChange={() => handleRadioChange(order?.id)}
                  className="h-5 w-5 rounded-md text-primary focus:ring-2 focus:ring-primary dark:text-secondary dark:focus:ring-secondary"
                />
                <label htmlFor={order?.id} className="font-medium text-black">
                  {order?.id}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedData || withOutPo ? (
        <div className="flex min-h-screen w-[92vw] items-center justify-center bg-gray-50 p-10 xl:w-[75vw]">
          <div className="font-sans overflow-x-auto rounded-lg border border-gray-300 bg-white text-gray-800 shadow-lg">
            {/* Header Section */}
            <div className="flex items-center justify-between rounded-t-lg border-b border-gray-300 bg-blue-50 p-6">
              <div className="flex items-center">
                <Image
                  className="rounded-md"
                  width={200} // Adjusted for better size
                  height={100} // Adjusted for better size
                  src={"/images/logo/sanatan-logo.png"}
                  alt="Logo"
                  priority
                />
              </div>
              <div className="flex-1 px-6 text-center">
                <h1 className="text-2xl font-semibold uppercase text-blue-700">
                  Sanatan Express India Pvt. Ltd.
                </h1>
                <p className="text-sm text-gray-600">
                  PAN No: ABKCS2779J | GSTIN: 23ABKCS2779J1ZV
                </p>
                <p className="text-sm text-gray-600">
                  Shop No 10, 1st Floor, Plot No 888, Loha Mandi, Dewas Naka,
                  Indore 452010
                </p>
                <p className="text-sm text-gray-600">
                  Mobile: 9782760844 | Email: proprie@sanatanexpress.in
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 text-sm">
              {/* Top Section */}
              <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* First Section */}
                <div className="rounded-lg border border-gray-300 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                  <div className="mb-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-lg font-semibold">
                        Order No: {selectedData?.id || "NA"}
                      </label>

                      <label className="text-lg font-semibold">
                        PAN No: ABKCS2779J
                      </label>
                      <label className="text-lg font-semibold">
                        GSTIN: 23ABKCS2779J1ZV
                      </label>
                    </div>
                    <div className="my-4 border-b-2 border-gray-300"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">
                        Eway Bill No:
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Eway Bill No"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">
                        Expiry Date:
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Expiry Date"
                      />
                    </div>
                  </div>
                </div>

                {/* Second Section */}
                <div className="rounded-lg border border-gray-300 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                  <div className="mb-4 text-center">
                    <label className="text-xl font-semibold text-blue-700">
                      Copy
                    </label>
                    <div className="my-4 border-b-2 border-gray-300"></div>
                    <label className="text-xl font-semibold text-blue-700">
                      At Owner&apos;s Risk/Insurance
                    </label>
                    <div className="my-4 border-b-2 border-gray-300"></div>
                  </div>

                  <div className="text-sm font-medium text-gray-700">
                    <div className="mb-2">The Consignor has stated that</div>

                    {/* Not insured consignment */}
                    <div className="mb-4 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="notInsured"
                        className="h-5 w-5 text-blue-500"
                      />
                      <label htmlFor="notInsured" className="font-medium">
                        He has not insured consignment
                      </label>
                    </div>

                    {/* Insured consignment */}
                    <div className="mb-4 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="insured"
                        className="h-5 w-5 text-blue-500"
                      />
                      <label htmlFor="insured" className="font-medium">
                        He has insured consignment
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">
                        Company:
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Company"
                      />
                      <label className="font-semibold text-gray-700">
                        Policy No:
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Policy No"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">
                        Date:
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Date"
                      />
                      <label className="font-semibold text-gray-700">
                        Amount:
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Amount"
                      />
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
                        placeholder="Enter Date"
                      />
                      <div className="my-4 border-b-2 border-gray-300"></div>
                    </div>

                    <div className="flex flex-col space-y-4">
                      <label className="font-semibold text-gray-700">
                        Vehicle No:
                      </label>
                      <select
                        onChange={handleVehicleChange}
                        className="rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Vehicle Number</option>
                        {VehicleData.map((vehicle, index) => (
                          <option key={index} value={vehicle.Vehicle.TruckNo}>
                            {vehicle.Vehicle.TruckNo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignor and Consignee Details */}
              <div className="mb-8 flex flex-col gap-6 sm:flex-row">
                <div className="w-full sm:w-2/3">
                  {/* Consignor Section */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700">
                      Select Consignor
                    </label>
                    <select
                      onChange={handleConsignorChange}
                      className="rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Consignor</option>
                      {ConsignorData.map((consignor, index) => (
                        <option key={index} value={consignor.id}>
                          {consignor.businessName}
                        </option>
                      ))}
                    </select>

                    <div className="mt-2 h-10 w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500">
                      Consignor GSTIN : {SelectedConsignor?.gstin || ""}
                    </div>

                    <div className="mt-2 h-10 w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500">
                      Address :{" "}
                      {SelectedConsignor?.address
                        ? `${SelectedConsignor?.address.street}, ${SelectedConsignor?.address.city}, ${SelectedConsignor?.address.state}, ${SelectedConsignor?.address.zip}`
                        : ""}
                    </div>
                  </div>

                  {/* Consignee Section */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700">
                      Select Consignee
                    </label>
                    <select
                      onChange={handleConsigneeChange}
                      className="rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Consignee</option>
                      {ConsigneeData.map((consignor: any, index: any) => (
                        <option key={index} value={consignor.id}>
                          {consignor.businessName}
                        </option>
                      ))}
                    </select>

                    <div className="mt-2 h-10 w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500">
                      Consignee GSTIN : {SelectedConsignee?.gstin || ""}
                    </div>

                    <div className="mt-2 h-10 w-full rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500">
                      Address :{" "}
                      {SelectedConsignee?.address
                        ? `${SelectedConsignee?.address.street}, ${SelectedConsignee?.address.city}, ${SelectedConsignee?.address.state}, ${SelectedConsignee?.address.zip}`
                        : ""}
                    </div>
                  </div>
                </div>

                {/* Right Section: Serial No. and Date */}
                <div className="w-full rounded-lg border border-gray-300 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg sm:w-1/3">
                  <div className="flex flex-col gap-6">
                    {/* Serial No. */}

                    <div className="flex flex-col space-y-4">
                      <label className="font-semibold text-gray-700">
                        FromStation:
                      </label>
                      <select
                        onChange={handleStationChange}
                        className="rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Station</option>
                        {StationData.map((station, index) => (
                          <option key={index} value={station.id}>
                            {station.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col space-y-4">
                      <label className="font-semibold text-gray-700">
                        To Station:
                      </label>
                      <select
                        onChange={handleStationChange}
                        className="rounded-lg border border-gray-300 p-3 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Station</option>
                        {StationData.map((station, index) => (
                          <option key={index} value={station.id}>
                            {station.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 border-b border-gray-300 pb-2">
                <table className="w-1/2 border-collapse border border-gray-300 text-center xl:w-full">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Package</th>
                      <th className="border border-gray-300 p-2">
                        Description
                      </th>
                      <th className="border border-gray-300 p-2">
                        <div className="flex flex-col">
                          <span>Weight</span>
                          <div className="flex justify-center">
                            <span>Actual</span>
                            <div className="mx-2 h-8 border-r border-gray-300"></div>
                            <span className="ml-2">Charged</span>
                          </div>
                        </div>
                      </th>
                      <th className="border border-gray-300 p-2">
                        <div className="flex flex-col">
                          <span className="ml-2">Amount</span>
                        </div>
                      </th>
                      <th className="border border-gray-300 p-2">
                        <div className="flex flex-col">
                          <span className="ml-2">GSTIN</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border  border-gray-300 p-2">
                        <textarea
                          className=" h-[350px] border  border-gray-300 p-1 text-center"
                          placeholder=""
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <textarea
                          className=" h-[350px]  border  border-gray-300 p-1 text-center"
                          placeholder=""
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex space-x-2">
                          <textarea
                            className="h-[350px] w-1/2 border border-gray-300 p-1 text-center"
                            placeholder="Actual Weight"
                          />
                          <textarea
                            className="h-[350px] w-1/2 border border-gray-300 p-1 text-center"
                            placeholder="Charged Weight"
                          />
                        </div>
                      </td>

                      <td className="w-full border border-gray-300 p-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <label className="font-semibold">Freight:</label>

                            <textarea
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="flex justify-between">
                            <label className="font-semibold">
                              {" "}
                              Local Coll:
                            </label>
                            <input
                              type="text"
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="flex justify-between">
                            <label className="font-semibold">Labour:</label>
                            <input
                              type="text"
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="flex justify-between">
                            <label className="font-semibold">
                              Halting Chrage:
                            </label>
                            <input
                              type="text"
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="flex justify-between">
                            <label className="font-semibold">
                              TotalFreight:
                            </label>
                            <input
                              type="text"
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="mt-5 flex gap-5">
                            <input
                              type="checkbox"
                              id="rcm"
                              className="h-5 w-5"
                            />
                            <label className="font-semibold">RCM:</label>
                          </div>

                          <div className=" flex gap-5">
                            <input
                              type="checkbox"
                              id="fcm"
                              className="h-5 w-5"
                            />
                            <label className="font-semibold">FCM:</label>
                          </div>

                          <div className=" flex gap-5">
                            <input
                              type="checkbox"
                              id="tbb"
                              className="h-5 w-5"
                            />
                            <label className="font-semibold">TBB:</label>
                          </div>

                          <div className="flex gap-5">
                            <input
                              type="checkbox"
                              id="toPay"
                              className="h-5 w-5"
                            />
                            <label className="font-semibold">To Pay:</label>
                          </div>

                          <div className="flex gap-5">
                            <input
                              type="checkbox"
                              id="paid"
                              className="h-5 w-5"
                            />
                            <label className="font-semibold">Paid:</label>
                          </div>
                        </div>
                      </td>

                      <td className="w-full border border-gray-300 p-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <label className="font-semibold">
                              Total Freight:
                            </label>

                            <textarea
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="flex justify-between">
                            <label className="font-semibold"> CGST @ 6%:</label>
                            <textarea
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="flex justify-between">
                            <label className="font-semibold">SGST @ 6%:</label>
                            <textarea
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="flex justify-between">
                            <label className="font-semibold"> IGST @ 6%:</label>
                            <textarea
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="flex justify-between">
                            <label className="font-semibold">
                              Grand Total:
                            </label>
                            <textarea
                              className=" border border-gray-300 p-1 text-center"
                              placeholder=""
                            />
                          </div>

                          <div className="mt-4 flex justify-between">
                            <label className="font-semibold">
                              GST Payable by Tick the relevant box :
                            </label>
                          </div>

                          <div className="mb-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="notInsured"
                              className="h-5 w-5"
                            />
                            <label htmlFor="notInsured" className="font-medium">
                              Consignor
                            </label>
                          </div>
                          <div className="mb-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="notInsured"
                              className="h-5 w-5"
                            />
                            <label htmlFor="notInsured" className="font-medium">
                              Consignee
                            </label>
                          </div>
                          <div className="mb-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="notInsured"
                              className="h-5 w-5"
                            />
                            <label htmlFor="notInsured" className="font-medium">
                              Transporter
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Footer Section */}
              <div className="mt-8 rounded-lg bg-gray-100 p-6 shadow-md">
                <div className="flex flex-col justify-between text-sm">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700">
                      Invoice Number:
                    </label>
                    <input
                      type="text"
                      className="w-1/2 rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700">
                      Value:
                    </label>
                    <input
                      type="text"
                      className="w-1/2 rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500"
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
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Select Orders to view details.
        </div>
      )}
    </>
  );
};

export default BilltyEntry;
