import React, { useMemo, useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { DatePicker, message, Spin } from "antd";
import dayjs from "dayjs";
import attendanceService from "../Attendance/service/Attendance";

export default function AttendanceTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: null,
    emp_name: "",
    time_in: 0,
    time_out: 0,
    status: "Present",
    overtime_hours: 0,
  });

  const [detailModal, setDetailModal] = useState({ open: false, title: "", present: [], absent: [] });
  const [employeeDetailModal, setEmployeeDetailModal] = useState({ open: false, employee: null });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        date: selectedDate,
        status: statusFilter !== "All" ? statusFilter : undefined,
        page: currentPage,
        limit: rowsPerPage,
      };
      const response = await attendanceService.getAll(params);
      setRecords(response.data.attandance || []);
      console.log("Fetched records:", response.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [search, selectedDate, statusFilter, currentPage]);

  const matchesSearch = (record, q) => {
    if (!q) return true;
    const s = q.trim().toLowerCase();
    return (
      String(record.employeeId).toLowerCase().includes(s) ||
      String(record.employeeName).toLowerCase().includes(s)
    );
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => matchesSearch(r, search));
  }, [records, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + rowsPerPage);

  const openFormForNew = (employee) => {
    setFormData({
      employeeId: employee?.employeeId || "",
      employeeName: employee?.employeeName || "",
      date: dayjs(),
      status: "Present",
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
      date: rec.date ? dayjs(rec.date, "DD/MM/YYYY") : dayjs(),
      status: rec.status || "Present",
    });
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.employeeId || !formData.employeeName || !formData.date || !formData.status) {
      message.warning("Please fill all required fields");
      return;
    }

    const newRecord = {
      employeeId: String(formData.employeeId).trim(),
      employeeName: String(formData.employeeName).trim(),
      date: dayjs(formData.date).format("DD/MM/YYYY"),
      weekPresent: 0,
      weekAbsent: 0,
      monthPresent: 0,
      monthAbsent: 0,
      otHours: 0,
      odDays: 0,
      status: formData.status,
    };

    try {
      if (editIndex !== null && editIndex >= 0 && editIndex < records.length) {
        await attendanceService.update(records[editIndex].employeeId, records[editIndex].date, newRecord);
        message.success("Record updated");
      } else {
        await attendanceService.create(newRecord);
        message.success("Record added");
      }
      setModalOpen(false);
      setEditIndex(null);
      fetchRecords();
    } catch (err) {
      console.error(err);
      message.error("Failed to save record");
    }
  };

  const handleShowDetail = (record, type) => {
    const totalDays = type === "Week" ? 6 : 30;
    const startDay =
      type === "Week"
        ? dayjs(record.date, "DD/MM/YYYY").startOf("week").add(1, "day")
        : dayjs(record.date, "DD/MM/YYYY").startOf("month");

    const presentCount = type === "Week" ? record.weekPresent : record.monthPresent;
    const absentCount = type === "Week" ? record.weekAbsent : record.monthAbsent;

    const present = [];
    const absent = [];
    let addedPresent = 0;
    let addedAbsent = 0;

    for (let i = 0; i < totalDays; i++) {
      const day = startDay.add(i, "day");
      if (day.day() === 0) continue;
      if (addedPresent < presentCount) {
        present.push(day.format("DD/MM/YYYY"));
        addedPresent++;
      } else if (addedAbsent < absentCount) {
        absent.push(day.format("DD/MM/YYYY"));
        addedAbsent++;
      }
    }

    setDetailModal({ open: true, title: `${record.employeeName} - ${type} Details`, present, absent });
  };

  const handleUpdateToday = () => {
    const todayStr = dayjs().format("DD/MM/YYYY");
    let todayRecordIndex = records.findIndex((r) => r.date === todayStr);
    if (todayRecordIndex >= 0) {
      openFormForEdit(todayRecordIndex);
    } else {
      openFormForNew();
    }
  };

  const handleShowEmployeeDetails = (record) => {
    setEmployeeDetailModal({ open: true, employee: record });
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="font-semibold text-xl mb-6">Attendance Records</h1>


      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex-1 flex justify-end items-center gap-3 w-full lg:w-auto">
       
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID or Name..."
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-0"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1);
            }}
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
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>

          <button
            onClick={handleUpdateToday}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:scale-105 transition"
          >
            Update
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center p-8">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="border border-gray-100 p-4 text-left">Employee ID</th>
                <th className="border border-gray-100 p-4 text-left">Employee Name</th>
                <th className="border border-gray-100 p-4 text-center">Date</th>
                <th className="border border-gray-100 p-4 text-center">Week (P/A)</th>
                <th className="border border-gray-100 p-4 text-center">Month (P/A)</th>
                <th className="border border-gray-100 p-4 text-center">OT Hours</th>
                <th className="border border-gray-100 p-4 text-center">OD Days</th>
                <th className="border border-gray-100 p-4 text-center">Status</th>
                <th className="border border-gray-100 p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((r, idx) => {
                  const recordIndex = startIndex + idx;
                  return (
                    <tr key={`${r.employeeId}-${recordIndex}`} className="hover:bg-gray-50 text-gray-700 transition">
                      <td
                        className="border border-gray-200 p-4 font-semibold text-[#408CFF] align-middle cursor-pointer underline"
                        onClick={() => handleShowEmployeeDetails(r)}
                      >
                        {r.employeeId}
                      </td>
                      <td className="border border-gray-200 p-4 align-middle">{r.employeeName}</td>
                      <td className="border border-gray-200 p-4 text-center align-middle">{r.date}</td>
                      <td
                        className="border border-gray-200 p-4 text-center align-middle text-blue-600 underline cursor-pointer"
                        onClick={() => handleShowDetail(r, "Week")}
                      >
                        {r.weekPresent} / {r.weekAbsent}
                      </td>
                      <td
                        className="border border-gray-200 p-4 text-center align-middle text-blue-600 underline cursor-pointer"
                        onClick={() => handleShowDetail(r, "Month")}
                      >
                        {r.monthPresent} / {r.monthAbsent}
                      </td>
                      <td className="border border-gray-200 p-4 text-center align-middle">{r.otHours}</td>
                      <td className="border border-gray-200 p-4 text-center align-middle">{r.odDays}</td>
                      <td className="border border-gray-200 p-4 text-center align-middle">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-bold ${
                            r.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : r.status === "Absent"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="border border-gray-200 p-4 text-center align-middle">
                        <button
                          onClick={() => openFormForEdit(recordIndex)}
                          className="p-3 bg-black text-white rounded hover:scale-105 transition"
                          title="Edit"
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center text-gray-400 italic p-8">
                    No attendance records match the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {filteredRecords.length === 0 ? 0 : startIndex + 1} -{" "}
          {Math.min(startIndex + rowsPerPage, filteredRecords.length)} of {filteredRecords.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="px-4 py-1 border rounded">{currentPage} / {totalPages}</div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? "Edit Attendance" : "Add Attendance"}</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) => handleFormChange("employeeId", e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none"
              />
              <input
                type="text"
                placeholder="Employee Name"
                value={formData.employeeName}
                onChange={(e) => handleFormChange("employeeName", e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none"
              />
              <DatePicker
                value={formData.date ? dayjs(formData.date) : dayjs()}
                format="DD/MM/YYYY"
                className="w-full"
                onChange={(date) => handleFormChange("date", date)}
                size="large"
              />
              <select
                value={formData.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleFormSubmit} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-500">
                Save
              </button>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditIndex(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
