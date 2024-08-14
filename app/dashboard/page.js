"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ recordName: "", recordDescription: "" });
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.post("http://localhost/p2ass/user.php", {
        operation: "getRecord",
      });
      console.log("Fetched records:", response.data);
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    }
  };

  const addRecord = async () => {
    try {
        const response = await axios.post("http://localhost/p2ass/user.php", {
            operation: "addRecord",
            recordName: newRecord.recordName,
            recordDescription: newRecord.recordDescription,
        });
        if (response.data.status === 1) {
            setNewRecord({ recordName: "", recordDescription: "" });
            fetchRecords();
        } else {
            alert(response.data.message || "Failed to add record");
        }
    } catch (error) {
        console.error("Failed to add record:", error);
    }
};


const updateRecord = async (id) => {
    try {
      const updatedRecord = {
        operation: "updateRecord", // Match the operation name in PHP
        recordId: id,
        recordName: editingRecord.record_name,
        recordDescription: editingRecord.record_description
      };
      const response = await axios.post("http://localhost/p2ass/user.php", updatedRecord);

      if (response.data.success) {
        setEditingRecord(null);
        fetchRecords();
      } else {
        alert("Failed to update record: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to update record:", error);
    }
  };


  const deleteRecord = async (id) => {
    try {
      const response = await axios.post("http://localhost/p2ass/user.php", {
        operation: "deleteRecord", // Ensure this matches the operation name in PHP
        recordId: id,
      });

      if (response.data.success) {
        fetchRecords();
      } else {
        alert("Failed to delete record: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Record</h2>
        <input
          type="text"
          placeholder="Record Name"
          value={newRecord.recordName}
          onChange={(e) => setNewRecord({ ...newRecord, recordName: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Record Description"
          value={newRecord.recordDescription}
          onChange={(e) => setNewRecord({ ...newRecord, recordDescription: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={addRecord} className="bg-blue-500 text-white p-2 rounded">
          Add Record
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Date and Time</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.record_id}>
                <td className="py-2 px-4 border-b text-center">{record.record_id}</td>
                <td className="py-2 px-4 border-b">
                  {editingRecord?.record_id === record.record_id ? (
                    <input
                      type="text"
                      value={editingRecord.record_name}
                      onChange={(e) =>
                        setEditingRecord({ ...editingRecord, record_name: e.target.value })
                      }
                      className="border p-2 w-full"
                    />
                  ) : (
                    record.record_name
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editingRecord?.record_id === record.record_id ? (
                    <input
                      type="text"
                      value={editingRecord.record_description}
                      onChange={(e) =>
                        setEditingRecord({ ...editingRecord, record_description: e.target.value })
                      }
                      className="border p-2 w-full"
                    />
                  ) : (
                    record.record_description
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.formatted_created_at}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editingRecord?.record_id === record.record_id ? (
                    <button
                      onClick={() => updateRecord(record.record_id)}
                      className="bg-green-500 text-white p-2 rounded mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingRecord(record)}
                      className="bg-yellow-500 text-white p-2 rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteRecord(record.record_id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;
