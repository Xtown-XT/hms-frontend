import React, { useMemo, useState, useEffect } from "react";
import { DatePicker, message, Spin, Input, Button, Popover, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";
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

  const [detailModal, setDetailModal] = useState({
    open: false,
    title: "",
    present: [],
    absent: [],
  });
  const [employeeDetailModal, setEmployeeDetailModal] = useState({
    open: false,
    employee: null,
  });

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

    setDetailModal({
      open: true,
      title: `${record.employeeName} - ${type} Details`,
      present,
      absent,
    });
  };

  const handleShowEmployeeDetails = (record) => {
    setEmployeeDetailModal({ open: true, employee: record });
  };

  // ✅ Filter Popover Component
  const FiltersPopover = () => (
    <div className="flex flex-col gap-3 w-52">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border rounded-md p-2"
        >
          <option value="All">All</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <DatePicker
          value={selectedDate ? dayjs(selectedDate) : null}
          onChange={(date) => {
            setSelectedDate(date ? date.format("YYYY-MM-DD") : "");
            setCurrentPage(1);
          }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="font-semibold text-xl mb-6">Attendance Records</h1>

      {/* ✅ Right-Aligned Search + Filter Section */}
      <div className="flex justify-end mb-6">
        <Space>
          <Input.Search
            placeholder="Search by name or ID"
            allowClear
            style={{ width: 240 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Popover
            content={<FiltersPopover />}
            trigger="click"
            placement="bottomRight"
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Popover>
        </Space>
      </div>

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
                <th className="border border-gray-100 p-4 text-center">Department</th>
                <th className="border border-gray-100 p-4 text-center">Week (P/A)</th>
                <th className="border border-gray-100 p-4 text-center">Month (P/A)</th>
                <th className="border border-gray-100 p-4 text-center">OT Hours</th>
                <th className="border border-gray-100 p-4 text-center">OD Days</th>
                <th className="border border-gray-100 p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((r, idx) => (
                  <tr
                    key={`${r.employeeId}-${idx}`}
                    className="hover:bg-gray-50 text-gray-700 transition"
                  >
                    <td
                      className="border border-gray-200 p-4 font-semibold text-[#408CFF] align-middle cursor-pointer underline"
                      onClick={() => handleShowEmployeeDetails(r)}
                    >
                      {r.employeeId}
                    </td>
                    <td className="border border-gray-200 p-4 align-middle">
                      {r.employeeName}
                    </td>
                    <td className="border border-gray-200 p-4 text-center align-middle">
                      {r.department || "-"}
                    </td>
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
                    <td className="border border-gray-200 p-4 text-center align-middle">
                      {r.otHours}
                    </td>
                    <td className="border border-gray-200 p-4 text-center align-middle">
                      {r.odDays}
                    </td>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 italic p-8">
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
          {Math.min(startIndex + rowsPerPage, filteredRecords.length)} of{" "}
          {filteredRecords.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="px-4 py-1 border rounded">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}





// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   DatePicker,
//   Button,
//   message,
//   Popconfirm,
//   Spin,
// } from "antd";
// import { FaPencilAlt, FaTrash } from "react-icons/fa";
// import { PlusOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import attendanceService from "../Attendance/service/Attendance";

// const { Option } = Select;

// export default function AttendanceMaster() {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);
//   const [form] = Form.useForm();

//   // ✅ Fetch Attendance Records
//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);
//       const res = await attendanceService.getAll({
//         search: "",
//         date: "",
//         page: 1,
//         limit: 10,
//       });
//       console.log("✅ Attendance Data:", res.data);
//       setRecords(res.data.attandance || res.data || []);
//     } catch (error) {
//       console.error("❌ Error fetching attendance:", error);
//       message.error("Failed to fetch attendance data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   // ✅ Handle Add / Edit Modal
//   const openModal = (record = null) => {
//     if (record) {
//       form.setFieldsValue({
//         emp_id: record.emp_id,
//         emp_name: record.emp_name,
//         date: dayjs(record.date),
//         status: record.status,
//       });
//       setEditingRecord(record);
//     } else {
//       form.resetFields();
//       setEditingRecord(null);
//     }
//     setIsModalOpen(true);
//   };

//   // ✅ Handle Save
//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const payload = {
//         emp_id: values.emp_id.trim(),
//         emp_name: values.emp_name.trim(),
//         date: dayjs(values.date).format("YYYY-MM-DD"),
//         status: values.status,
//       };

//       if (editingRecord) {
//         await attendanceService.update(payload.emp_id, payload.date, payload);
//         message.success("Attendance updated successfully");
//       } else {
//         await attendanceService.create(payload);
//         message.success("Attendance created successfully");
//       }

//       setIsModalOpen(false);
//       fetchAttendance();
//     } catch (error) {
//       console.error("❌ Error saving:", error);
//       message.error("Failed to save attendance record");
//     }
//   };


//   return (
//     <div className="p-4 bg-white rounded-xl shadow-md">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Attendance Management
//         </h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           style={{
//             background:
//               "linear-gradient(90deg, #408CFF 0%, #EF4CFF 100%)",
//             border: "none",
//           }}
//           onClick={() => openModal()}
//         >
//           Add Attendance
//         </Button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <Spin size="large" />
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border text-sm text-gray-700">
//             <thead className="bg-gray-100 text-gray-900">
//               <tr>
//                 <th className="p-2 border">Employee ID</th>
//                 <th className="p-2 border">Employee Name</th>
//                 <th className="p-2 border">Date</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.length > 0 ? (
//                 records.map((r, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="p-2 border">{r.emp_id}</td>
//                     <td className="p-2 border">{r.emp_name}</td>
//                     <td className="p-2 border">
//                       {dayjs(r.date).format("YYYY-MM-DD")}
//                     </td>
//                     <td className="p-2 border">{r.status}</td>
//                     <td className="p-2 border text-center space-x-2">
//                       <Button
//                         icon={<FaPencilAlt />}
//                         size="small"
//                         onClick={() => openModal(r)}
//                       />
//                       <Popconfirm
//                         title="Are you sure you want to delete?"
//                         onConfirm={() => handleDelete(r.emp_id, r.date)}
//                       >
//                         <Button
//                           danger
//                           size="small"
//                           icon={<FaTrash />}
//                         />
//                       </Popconfirm>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="text-center text-gray-500 p-3"
//                   >
//                     No records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ✅ Modal */}
//       <Modal
//         title={editingRecord ? "Edit Attendance" : "Add Attendance"}
//         open={isModalOpen}
//         onOk={handleSave}
//         onCancel={() => setIsModalOpen(false)}
//         okText="Save"
//         cancelText="Cancel"
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Employee ID"
//             name="emp_id"
//             rules={[{ required: true, message: "Please enter Employee ID" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Employee Name"
//             name="emp_name"
//             rules={[{ required: true, message: "Please enter Employee Name" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Date"
//             name="date"
//             rules={[{ required: true, message: "Please select date" }]}
//           >
//             <DatePicker className="w-full" />
//           </Form.Item>
//           <Form.Item label="Status" name="status" initialValue="Present">
//             <Select>
//               <Option value="Present">Present</Option>
//               <Option value="Absent">Absent</Option>
//               <Option value="Leave">Leave</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// }
