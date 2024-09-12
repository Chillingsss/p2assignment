import React from "react";

const ViewDetails = ({ record, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">View Details</h2>
        <p>
          <strong>Name:</strong> {record.contact_name}
        </p>
        <p>
          <strong>Contact Number:</strong> {record.contact_phone}
        </p>
        <p>
          <strong>Email:</strong> {record.contact_email}
        </p>
        <p>
          <strong>Address:</strong> {record.contact_address}
        </p>
        <p>
          <strong>User:</strong> {record.usr_fullname}
        </p>
        <p>
          <strong>Group:</strong> {record.grp_name}
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
