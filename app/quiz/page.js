"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ViewDetails from "../modal/ViewDetails";
import InsertRecord from "../modal/InsertRecord";
import UpdateDetails from "../modal/UpdateDetails";

const Quiz = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    contact_id: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    contact_userId: "",
    contact_group: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
        const formData = new FormData();
        formData.append("operation", "getUsers");
        const response = await axios.post(url, formData);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const fetchGroups = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
        const formData = new FormData();
        formData.append("operation", "getGroups");
        const response = await axios.post(url, formData);
        setGroups(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    fetchRecords();
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchRecords = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const formData = new FormData();
      formData.append("operation", "getRecord");
      const response = await axios.post(url, formData);
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    }
  };

  const fetchRecordDetails = async (contact_id) => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const formData = new FormData();
      formData.append("operation", "getDetails");
      formData.append("json", JSON.stringify({ contact_id }));
      const response = await axios.post(url, formData);
      setSelectedRecord(response.data);
      setFormData(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("Failed to fetch record details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const formData = new FormData();
      formData.append("operation", "deleteRecord");
      formData.append(
        "json",
        JSON.stringify({ contact_id: selectedRecord.contact_id })
      );
      const response = await axios.post(url, formData);
      if (response.data.status === 1) {
        fetchRecords();
        setShowViewModal(false);
      } else {
        alert("Failed to delete record.");
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const formDataToSend = new FormData();
      formDataToSend.append("operation", "updateRecord");
      formDataToSend.append("json", JSON.stringify(formData));

      const response = await axios.post(url, formDataToSend);
      // console.log("Response:", response.data);
      if (response.data.status === 1) {
        fetchRecords();
        setShowUpdateModal(false);
        resetFormData();
      } else {
        alert("Failed to update record.");
      }
    } catch (error) {
      console.error("Failed to update record:", error);
    }
  };

  const handleInsert = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const formDataToSend = new FormData();
      formDataToSend.append("operation", "insertRecord");
      formDataToSend.append("json", JSON.stringify(formData));

      const response = await axios.post(url, formDataToSend);
      if (response.data.status === 1) {
        fetchRecords();
        setShowInsertModal(false);
        resetFormData();
      } else {
        alert("Failed to insert record.");
      }
    } catch (error) {
      console.error("Failed to insert record:", error);
    }
  };

  const resetFormData = () => {
    setFormData({
      contact_id: "",
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      contact_address: "",
      contact_userId: "",
      contact_group: "",
    });
  };

  const closeModal = () => {
    setShowViewModal(false);
    setShowInsertModal(false);
    setShowUpdateModal(false);
    setSelectedRecord(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Records</h1>
      <h2 className="text-xl font-semibold mb-4">Records List</h2>

      <div className="mb-4">
        <button
          onClick={() => setShowInsertModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Insert New Record
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Contact Number</th>
            <th className="px-4 py-2 text-left">Contact Address</th>

            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.contact_id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{record.contact_name}</td>
              <td className="px-4 py-2">{record.contact_phone}</td>
              <td className="px-4 py-2">{record.contact_address}</td>
              <td className="px-4 py-2 w-64">
                <button
                  onClick={() => fetchRecordDetails(record.contact_id)}
                  className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    setFormData(record);
                    setShowUpdateModal(true);
                  }}
                  className="px-2 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 ml-2"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showViewModal && selectedRecord && (
        <ViewDetails
          record={selectedRecord}
          onClose={closeModal}
          onDelete={handleDelete}
        />
      )}

      {showInsertModal && (
        <InsertRecord
          formData={{}}
          users={users}
          groups={groups}
          handleChange={handleChange}
          handleInsert={handleInsert}
          onClose={closeModal}
        />
      )}

      {showUpdateModal && (
        <UpdateDetails
          formData={formData}
          users={users}
          groups={groups}
          handleChange={handleChange}
          handleUpdate={handleUpdate}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Quiz;
