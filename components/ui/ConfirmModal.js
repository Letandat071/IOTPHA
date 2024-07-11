/// File confirm thông báo của hệ thống localhost
import React, { useEffect } from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`modal-container bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative ${isOpen ? 'modal-visible' : 'modal-hidden'}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Xác nhận</h2>
        <p className="text-center mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
