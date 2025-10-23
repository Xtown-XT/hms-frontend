import React, { useMemo, useState, useRef, useEffect } from "react";

export function generateRandomAttendance() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const statuses = ["P", "A", "L", "OD", "CL", "SL", "PR"];
  const attendance = {};
  days.forEach((day) => {
    attendance[day] = statuses[Math.floor(Math.random() * statuses.length)];
  });
  return attendance;
}

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function StaffMonthlyTable({ staffData }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const now = new Date();
  const [month, setMonth] = useState(monthNames[now.getMonth()]);
  const [year, setYear] = useState(now.getFullYear());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [query, setQuery] = useState("");

  const monthRef = useRef(null);
  const yearRef = useRef(null);


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

  const calculateTotals = (attendance) => {
    const totals = { presentDays: 0, absentDays: 0, leaveDays: 0, lateMinutes: 0, overtime: 0 };
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
    totals.totalHours = (totals.presentDays + totals.leaveDays) * 8 + totals.overtime - totals.lateMinutes / 60;
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-sky-50 to-white/90 p-6">
      <div className="w-full flex items-start justify-between gap-4 mb-6">
        <h1 className="font-semibold text-xl">
          Staff Monthly Record
        </h1>

        <div className="flex items-center gap-3 relative z-30">


          <div ref={monthRef} className="relative">
            <button
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm w-32 text-left focus:outline-none focus:ring-0"
            >
              {month}
            </button>
            {showMonthDropdown && (
              <ul className="absolute z-50 mt-1 w-32 bg-white border border-gray-300 shadow-lg rounded-xl max-h-40 overflow-auto right-0 left-0">
                {monthNames.map((m) => (
                  <li
                    key={m}
                    onClick={() => { setMonth(m); setShowMonthDropdown(false); }}
                    className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div ref={yearRef} className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm w-24 text-left focus:outline-none focus:ring-0"
            >
              {year}
            </button>
            {showYearDropdown && (
              <ul className="absolute z-50 mt-1 w-24 bg-white border border-gray-300 shadow-lg rounded-xl max-h-40 overflow-auto right-0 left-0">
                {years.map((y) => (
                  <li
                    key={y}
                    onClick={() => { setYear(y); setShowYearDropdown(false); }}
                    className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                  >
                    {y}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div className="relative">
            <input
              type="search"
              placeholder="Search employee, ID, dept..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-white shadow-sm border border-gray-200 text-sm w-64 focus:outline-none focus:ring-0"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
            </div>
          </div>
        </div>
      </div>


      <div className="w-full flex justify-end mb-4">
        <div className="bg-white/80 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-3 text-sm flex gap-3 flex-wrap">
          <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-full bg-green-600 text-white font-semibold">P</span>Present</div>
          <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-full bg-red-600 text-white font-semibold">A</span>Absent</div>
          <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-full bg-blue-600 text-white font-semibold">CL</span>Casual Leave</div>
          <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-full bg-purple-600 text-white font-semibold">SL</span>Sick Leave</div>
          <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-full bg-orange-500 text-white font-semibold">L</span>Leave</div>
          <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-full bg-yellow-400 text-white font-semibold">OD</span>On Duty</div>
          <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-full bg-gray-400 text-white font-semibold">PR</span>Permission</div>
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
                {days.map((d) => <th key={d} className="px-2 py-3 text-center text-sm font-bold text-gray-500 w-[48px]">{d}</th>)}
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">Present</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">Absent</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">Leave</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[110px] text-center">Late min</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[90px] text-center">Overtime</th>
                <th className="px-6 py-3 text-sm font-bold text-gray-600 w-[110px] text-center">Total hrs</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {filteredStaff && filteredStaff.length > 0 ? (
                filteredStaff.map((staff, index) => {
                  const totals = calculateTotals(staff.attendance);
                  return (
                    <tr key={staff.id || index} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{staff.employeeId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{staff.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{staff.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{staff.designation}</td>
                      {days.map((day) => (
                        <td key={day} className="px-2 py-3 text-center">
                          <span className={statusBadge(staff.attendance[day])}>{staff.attendance[day]}</span>
                        </td>
                      ))}
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{totals.presentDays}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{totals.absentDays}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{totals.leaveDays}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{totals.lateMinutes}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{totals.overtime}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{totals.totalHours.toFixed(1)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={days.length + 12} className="px-6 py-10 text-center text-gray-400">No staff data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
