"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [newRecordData, setNewRecordData] = useState({
    cars_make: "",
    cars_model: "",
    cars_year: "",
  });
  const [editRecordId, setEditRecordId] = useState(null);
  const [editRecordData, setEditRecordData] = useState({
    cars_make: "",
    cars_model: "",
    cars_year: "",
  });

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
        recordMake: newRecordData.cars_make,
        recordModel: newRecordData.cars_model,
        recordYear: newRecordData.cars_year,
      });
      if (response.data.status === 1) {
        setNewRecordData({ cars_make: "", cars_model: "", cars_year: "" });
        fetchRecords();
      } else {
        alert(response.data.message || "Failed to add record");
      }
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };

  const updateRecord = async (recordId) => {
    try {
      const response = await axios.post("http://localhost/p2ass/user.php", {
        operation: "updateRecord",
        recordId: recordId,
        recordMake: editRecordData.cars_make,
        recordModel: editRecordData.cars_model,
        recordYear: editRecordData.cars_year,
      });
      if (response.data.success) {
        setEditRecordId(null);
        fetchRecords();
      } else {
        alert(response.data.error || "Failed to update record");
      }
    } catch (error) {
      console.error("Failed to update record:", error);
    }
  };

  const deleteRecord = async (recordId) => {
    try {
      const response = await axios.post("http://localhost/p2ass/user.php", {
        operation: "deleteRecord",
        recordId: recordId,
      });
      if (response.data.success) {
        fetchRecords();
      } else {
        alert(response.data.error || "Failed to delete record");
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const handleNewInputChange = (e) => {
    setNewRecordData({ ...newRecordData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditRecordData({ ...editRecordData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (record) => {
    setEditRecordId(record.cars_id);
    setEditRecordData({
      cars_make: record.cars_make,
      cars_model: record.cars_model,
      cars_year: record.cars_year,
    });
  };

  const handleCancelClick = () => {
    setEditRecordId(null);
    setEditRecordData({ cars_make: "", cars_model: "", cars_year: "" });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Car</h2>
        <input
          type="text"
          placeholder="Make"
          name="cars_make"
          value={newRecordData.cars_make}
          onChange={handleNewInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Model"
          name="cars_model"
          value={newRecordData.cars_model}
          onChange={handleNewInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Year"
          name="cars_year"
          value={newRecordData.cars_year}
          onChange={handleNewInputChange}
          className="border p-2 mr-2"
        />
        <button
          onClick={addRecord}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Record
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Make</th>
              <th className="py-2 px-4 border-b">Model</th>
              <th className="py-2 px-4 border-b">Year</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.cars_id}>
                <td className="py-2 px-4 border-b text-center">
                  {record.cars_id}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editRecordId === record.cars_id ? (
                    <input
                      type="text"
                      name="cars_make"
                      value={editRecordData.cars_make}
                      onChange={handleEditInputChange}
                      className="border p-2 w-full"
                    />
                  ) : (
                    record.cars_make
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editRecordId === record.cars_id ? (
                    <input
                      type="text"
                      name="cars_model"
                      value={editRecordData.cars_model}
                      onChange={handleEditInputChange}
                      className="border p-2 w-full"
                    />
                  ) : (
                    record.cars_model
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editRecordId === record.cars_id ? (
                    <input
                      type="text"
                      name="cars_year"
                      value={editRecordData.cars_year}
                      onChange={handleEditInputChange}
                      className="border p-2 w-full"
                    />
                  ) : (
                    record.cars_year
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editRecordId === record.cars_id ? (
                    <>
                      <button
                        onClick={() => updateRecord(record.cars_id)}
                        className="bg-yellow-500 text-white p-2 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="bg-gray-500 text-white p-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(record)}
                        className="bg-green-500 text-white p-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRecord(record.cars_id)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
