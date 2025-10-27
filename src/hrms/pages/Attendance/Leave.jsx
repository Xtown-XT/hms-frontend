import React, { useMemo, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { Input, Select, Button, DatePicker, TimePicker, message } from "antd";
import dayjs from "dayjs";

const formatTimeForDisplay = (time) => {
  if (!time) return "--";
  if (typeof time === "string") return time;
  return dayjs(time).format("HH:mm");
};

export default function Leave() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    leaveType: null, 
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null,
    permission: null, 
  });

  const matchesSearch = (record, q) => {
    if (!q) return true;
    const s = q.trim().toLowerCase();
    return (
      String(record.employeeId).toLowerCase().includes(s) ||
      String(record.employeeName).toLowerCase().includes(s)
    );
  };

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((r) => {
      if (!matchesSearch(r, search)) return false;
      if (statusFilter !== "All" && r.permission !== statusFilter) return false;
      return true;
    });

    setTimeout(() => {
      const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
      if (currentPage > totalPages) setCurrentPage(1);
    }, 0);

    return filtered;
  }, [search, statusFilter, records, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + rowsPerPage);

  const openFormForNew = (employee) => {
    setFormData({
      employeeId: employee?.employeeId || "",
      employeeName: employee?.employeeName || "",
      leaveType: null,
      fromDate: null,
      toDate: null,
      fromTime: null,
      toTime: null,
      permission: null,
    });
    setEditIndex(null);
    setModalOpen(true);
  };

  const openFormForEdit = (index) => {
    const rec = records[index];
    if (!rec) return;
    setFormData({
      employeeId: rec.employeeId,
      employeeName: rec.employeeName,
      leaveType: rec.leaveType || null,
      fromDate: rec.fromDate ? dayjs(rec.fromDate, "DD/MM/YYYY") : null,
      toDate: rec.toDate ? dayjs(rec.toDate, "DD/MM/YYYY") : null,
      fromTime: rec.fromTime ? dayjs(rec.fromTime, "HH:mm") : null,
      toTime: rec.toTime ? dayjs(rec.toTime, "HH:mm") : null,
      permission: rec.permission || null,
    });
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    if (
      !formData.employeeId ||
      !formData.employeeName ||
      !formData.leaveType ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.permission
    ) {
      message.warning("Please fill all required fields");
      return;
    }

    const newRecord = {
      employeeId: String(formData.employeeId).trim(),
      employeeName: String(formData.employeeName).trim(),
      leaveType: formData.leaveType,
      fromDate: dayjs(formData.fromDate).format("DD/MM/YYYY"),
      toDate: dayjs(formData.toDate).format("DD/MM/YYYY"),
      fromTime: formData.fromTime ? dayjs(formData.fromTime).format("HH:mm") : null,
      toTime: formData.toTime ? dayjs(formData.toTime).format("HH:mm") : null,
      permission: formData.permission,
    };

    if (editIndex !== null && editIndex >= 0 && editIndex < records.length) {
      const next = [...records];
      next[editIndex] = { ...next[editIndex], ...newRecord };
      setRecords(next);
      message.success("Leave record updated");
    } else {
      setRecords((prev) => [...prev, newRecord]);
      message.success("Leave record added");
    }

    setModalOpen(false);
    setEditIndex(null);
  };

  const handleFormClear = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      leaveType: null,
      fromDate: null,
      toDate: null,
      fromTime: null,
      toTime: null,
      permission: null,
    });
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="font-semibold text-xl mb-6">Leave Management</h1>

      {/* Top Filters with Asset-style Search Box */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex-1 flex justify-end items-center gap-3 w-full lg:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Employee ID or Name..."
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-0"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-0"
          >
            <option value="All">All Permissions</option>
            <option value="Approved">Approved</option>
            <option value="Denied">Denied</option>
          </select>
          <button
            onClick={() => openFormForNew()}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:scale-105 transition"
          >
            Add Leave
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-100 p-4 text-left">Employee ID</th>
              <th className="border border-gray-100 p-4 text-left">Employee Name</th>
              <th className="border border-gray-100 p-4 text-center">Leave Type</th>
              <th className="border border-gray-100 p-4 text-center">From Date</th>
              <th className="border border-gray-100 p-4 text-center">To Date</th>
              <th className="border border-gray-100 p-4 text-center">From Time</th>
              <th className="border border-gray-100 p-4 text-center">To Time</th>
              <th className="border border-gray-100 p-4 text-center">Permission</th>
              <th className="border border-gray-100 p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((r, idx) => {
                const recordIndex = startIndex + idx;
                return (
                  <tr key={`${r.employeeId}-${recordIndex}`} className="hover:bg-gray-50 text-gray-700 transition">
                    <td className="border border-gray-200 p-4 font-semibold text-[#408CFF] align-middle cursor-pointer underline">
                      {r.employeeId}
                    </td>
                    <td className="border border-gray-200 p-4 align-middle">{r.employeeName}</td>
                    <td className="border border-gray-200 p-4 text-center align-middle">{r.leaveType}</td>
                    <td className="border border-gray-200 p-4 text-center align-middle">{r.fromDate}</td>
                    <td className="border border-gray-200 p-4 text-center align-middle">{r.toDate}</td>
                    <td className="border border-gray-200 p-4 text-center align-middle">{formatTimeForDisplay(r.fromTime)}</td>
                    <td className="border border-gray-200 p-4 text-center align-middle">{formatTimeForDisplay(r.toTime)}</td>
                    <td className="border border-gray-200 p-4 text-center align-middle">
                      <span className={`px-4 py-1 rounded-full text-sm font-bold ${r.permission === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {r.permission}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-4 text-center align-middle">
                      <button onClick={() => openFormForEdit(recordIndex)} className="p-3 bg-black text-white rounded hover:scale-105 transition" title="Edit">
                        <FaPencilAlt />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 italic p-8">
                  No leave records match the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {filteredRecords.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + rowsPerPage, filteredRecords.length)} of {filteredRecords.length}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="px-4 py-2 border rounded disabled:opacity-50" disabled={currentPage === 1}>Prev</button>
          <div className="px-4 py-2 border rounded">{currentPage} / {totalPages}</div>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="px-4 py-2 border rounded disabled:opacity-50" disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start lg:items-center justify-center z-50 overflow-auto py-10">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? "Edit Leave" : "Add Leave"}</h2>

            <div className="grid grid-cols-1 gap-4">
              <Input placeholder="Employee ID *" value={formData.employeeId} onChange={(e) => handleFormChange("employeeId", e.target.value)} size="large" className="focus:outline-none focus:ring-0"/>
              <Input placeholder="Employee Name *" value={formData.employeeName} onChange={(e) => handleFormChange("employeeName", e.target.value)} size="large" className="focus:outline-none focus:ring-0"/>
              <Select value={formData.leaveType} placeholder="Select Leave *" onChange={(value) => handleFormChange("leaveType", value)} options={[{ label: "Casual Leave", value: "Casual Leave" },{ label: "Sick Leave", value: "Sick Leave" },{ label: "Leave", value: "Leave" }]} size="large" className="w-full"/>
              <div className="grid grid-cols-2 gap-3">
                <DatePicker placeholder="From Date *" value={formData.fromDate ? dayjs(formData.fromDate) : null} format="DD/MM/YYYY" onChange={(date) => handleFormChange("fromDate", date)} className="w-full"/>
                <DatePicker placeholder="To Date *" value={formData.toDate ? dayjs(formData.toDate) : null} format="DD/MM/YYYY" onChange={(date) => handleFormChange("toDate", date)} className="w-full"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TimePicker placeholder="From Time" value={formData.fromTime ? dayjs(formData.fromTime, "HH:mm") : null} format="HH:mm" onChange={(time) => handleFormChange("fromTime", time)} className="w-full"/>
                <TimePicker placeholder="To Time" value={formData.toTime ? dayjs(formData.toTime, "HH:mm") : null} format="HH:mm" onChange={(time) => handleFormChange("toTime", time)} className="w-full"/>
              </div>
              <Select value={formData.permission} placeholder="Permission *" onChange={(value) => handleFormChange("permission", value)} options={[{ label: "Approved", value: "Approved" },{ label: "Denied", value: "Denied" }]} size="large" className="w-full"/>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="primary" onClick={handleFormSubmit}>Submit</Button>
              <Button onClick={() => { setModalOpen(false); setEditIndex(null); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
