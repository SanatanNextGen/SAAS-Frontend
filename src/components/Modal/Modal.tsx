import React, { useState } from "react";

const Modal = ({ isOpen, onClose, options, title }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[350px] rounded-md bg-white p-6 xl:w-1/3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="font-bold text-red-500">
            X
          </button>
        </div>
        <div className="mt-4">
          {options?.map((option: any, index: any) => (
            <button
              key={index}
              className="mt-2 block w-full rounded-md bg-blue-500 py-3 text-center text-white hover:bg-blue-600"
              onClick={() => option.onClick()}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
