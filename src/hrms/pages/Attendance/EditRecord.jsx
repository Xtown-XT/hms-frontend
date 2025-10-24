import React, { useMemo, useState, useEffect, useRef } from "react";

export function generateRandomAttendance() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const statuses = ["P", "A", "L", "OD", "CL", "SL", "PR"];
  const attendance = {};
  days.forEach((day) => {
    attendance[day] = statuses[Math.floor(Math.random() * statuses.length)];
  });
  return attendance;
}

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const sampleStaffData = [
  { id: 1, employeeId: "EMP001", name: "John Doe", department: "HR", designation: "Manager", attendance: generateRandomAttendance(), prHours: 0 },
  { id: 2, employeeId: "EMP002", name: "Jane Smith", department: "Finance", designation: "Accountant", attendance: generateRandomAttendance(), prHours: 0 },
  { id: 3, employeeId: "EMP003", name: "Michael Johnson", department: "IT", designation: "Developer", attendance: generateRandomAttendance(), prHours: 0 },
  { id: 4, employeeId: "EMP004", name: "Emily Davis", department: "Marketing", designation: "Executive", attendance: generateRandomAttendance(), prHours: 0 }
];

export default function EditRecord({ staffData: initialStaffData = sampleStaffData }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const now = new Date();
  const [month, setMonth] = useState(monthNames[now.getMonth()]);
  const [year, setYear] = useState(now.getFullYear());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [staffData, setStaffData] = useState(initialStaffData);
  const [editingRow, setEditingRow] = useState(null);
  const [backupRow, setBackupRow] = useState(null);
  const [toast, setToast] = useState("");

  // PR Modal state for from/to time
  const [prModal, setPrModal] = useState({ visible: false, staffId: null, day: null, fromTime: "", toTime: "" });

  const monthRef = useRef(null);
  const yearRef = useRef(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target)) setShowMonthDropdown(false);
      if (yearRef.current && !yearRef.current.contains(e.target)) setShowYearDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusBadge = (status) => {
    const base = "inline-flex items-center justify-center text-xs font-semibold px-2 py-1 rounded-full";
    switch (status) {
      case "P": return `${base} bg-green-600 text-white`;
      case "OD": return `${base} bg-yellow-400 text-white`;
      case "PR": return `${base} bg-gray-400 text-white`;
      case "A": return `${base} bg-red-600 text-white`;
      case "L": return `${base} bg-orange-500 text-white`;
      case "CL": return `${base} bg-blue-600 text-white`;
      case "SL": return `${base} bg-purple-600 text-white`;
      default: return `${base} bg-gray-300 text-gray-800`;
    }
  };

  const calculateTotals = (attendance, prHours = 0) => {
    const totals = { presentDays: 0, absentDays: 0, leaveDays: 0, lateMinutes: 0, overtime: 0, prHours };
    Object.values(attendance).forEach((status) => {
      switch (status) {
        case "P":
        case "OD":
        case "PR":
          totals.presentDays += 1;
          if (status === "OD") totals.overtime += Math.floor(Math.random() * 3);
          break;
        case "A":
          totals.absentDays += 1;
          break;
        case "CL":
        case "SL":
        case "L":
          totals.leaveDays += 1;
          if (status === "L") totals.lateMinutes += 15;
          break;
        default:
          break;
      }
    });
    totals.totalHours = (totals.presentDays + totals.leaveDays) * 8 + totals.overtime + prHours - totals.lateMinutes / 60;
    return totals;
  };

  const filteredStaff = useMemo(() => {
    if (!query?.trim()) return staffData;
    const q = query.toLowerCase();
    return staffData.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.employeeId.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q)
    );
  }, [query, staffData]);

  const handleAttendanceChange = (id, day, value) => {
    if (value === "PR") {
      setPrModal({ visible: true, staffId: id, day, fromTime: "", toTime: "" });
      return;
    }
    setStaffData((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, attendance: { ...staff.attendance, [day]: value } } : staff
      )
    );
  };

  const confirmPrHours = () => {
    const { staffId, day, fromTime, toTime } = prModal;
    if (!fromTime || !toTime) return;
    const start = new Date(`1970-01-01T${fromTime}`);
    const end = new Date(`1970-01-01T${toTime}`);
    let hours = (end - start) / (1000 * 60 * 60);
    if (hours <= 0) return;

    setStaffData(prev =>
      prev.map(staff =>
        staff.id === staffId
          ? {
              ...staff,
              attendance: { ...staff.attendance, [day]: "PR" },
              prHours: (staff.prHours || 0) + hours
            }
          : staff
      )
    );
    setPrModal({ visible: false, staffId: null, day: null, fromTime: "", toTime: "" });
    setToast(`✔ PR hours added: ${hours.toFixed(2)} hrs`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-sky-50 to-white/90 p-6 relative">

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}

      {prModal.visible && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-72">
            <h2 className="text-lg font-semibold mb-4">Enter PR From/To Time</h2>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-medium">From Time</label>
              <input
                type="time"
                value={prModal.fromTime}
                onChange={(e) => setPrModal({ ...prModal, fromTime: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
              <label className="text-sm font-medium">To Time</label>
              <input
                type="time"
                value={prModal.toTime}
                onChange={(e) => setPrModal({ ...prModal, toTime: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setPrModal({ visible: false, staffId: null, day: null, fromTime: "", toTime: "" })}>Cancel</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={confirmPrHours}>OK</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex items-start justify-between gap-4 mb-6">
        <h1 className="font-semibold text-xl">Edit Staff Records</h1>
        <div className="flex items-center gap-3 relative z-30">
          <div ref={monthRef} className="relative">
            <button onClick={() => setShowMonthDropdown(!showMonthDropdown)} className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm w-32 text-left focus:outline-none focus:ring-0">{month}</button>
            {showMonthDropdown && (
              <ul className="absolute z-50 mt-1 w-32 bg-white border border-gray-300 shadow-lg rounded-xl max-h-40 overflow-auto right-0 left-0">
                {monthNames.map((m) => <li key={m} onClick={() => { setMonth(m); setShowMonthDropdown(false); }} className="px-4 py-2 hover:bg-indigo-100 cursor-pointer">{m}</li>)}
              </ul>
            )}
          </div>
          <div ref={yearRef} className="relative">
            <button onClick={() => setShowYearDropdown(!showYearDropdown)} className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm w-24 text-left focus:outline-none focus:ring-0">{year}</button>
            {showYearDropdown && (
              <ul className="absolute z-50 mt-1 w-24 bg-white border border-gray-300 shadow-lg rounded-xl max-h-40 overflow-auto right-0 left-0">
                {years.map((y) => <li key={y} onClick={() => { setYear(y); setShowYearDropdown(false); }} className="px-4 py-2 hover:bg-indigo-100 cursor-pointer">{y}</li>)}
              </ul>
            )}
          </div>
          <input type="search" placeholder="Search employee, ID, dept..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl bg-white shadow-sm border border-gray-200 text-sm w-64 focus:outline-none focus:ring-0"/>
        </div>
      </div>

      <div className="w-full bg-white/60 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1200px] table-auto">
            <thead className="sticky top-0 bg-white/80 backdrop-blur z-20 shadow-sm">
              <tr className="text-left">
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[60px]">#</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[120px]">Employee ID</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[160px]">Employee Name</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[140px]">Department</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[140px]">Designation</th>
                {days.map(d => <th key={d} className="px-2 py-3 text-center text-sm font-bold text-gray-500 w-[48px]">{d}</th>)}
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">Present</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">Absent</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">Leave</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[110px] text-center">Late min</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">Overtime</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">PR hrs</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[110px] text-center">Total hrs</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[80px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredStaff.length > 0 ? filteredStaff.map((staff, index) => {
                const totals = calculateTotals(staff.attendance, staff.prHours);
                const isEditing = editingRow === staff.id;
                return (
                  <tr key={staff.id || index} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{staff.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{staff.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{staff.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{staff.designation}</td>
                    {days.map(day => (
                      <td key={day} className="px-2 py-3 text-center">
                        {isEditing ? (
                          <select
                            value={staff.attendance[day]}
                            onChange={(e) => handleAttendanceChange(staff.id, day, e.target.value)}
                            className="text-xs rounded px-1 py-0.5 border border-gray-300"
                          >
                            {["P","A","L","OD","CL","SL","PR"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={statusBadge(staff.attendance[day])}>{staff.attendance[day]}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{totals.presentDays}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{totals.absentDays}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{totals.leaveDays}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">{totals.lateMinutes}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">{totals.overtime}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">{staff.prHours.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{totals.totalHours.toFixed(1)}</td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <>
                          <button className="text-green-600 font-semibold mr-2" onClick={() => { setEditingRow(null); setToast("✔ Changes saved successfully"); }}>Save</button>
                          <button className="text-red-600 font-semibold" onClick={() => { setStaffData(prev => prev.map(s => (s.id === backupRow.id ? backupRow : s))); setEditingRow(null); }}>Cancel</button>
                        </>
                      ) : (
                        <button className="text-indigo-600 font-semibold" onClick={() => { setBackupRow(JSON.parse(JSON.stringify(staff))); setEditingRow(staff.id); }}>Edit</button>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={days.length + 14} className="px-6 py-10 text-center text-gray-400">No staff data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
