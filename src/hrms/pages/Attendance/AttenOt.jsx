import React, { useState } from "react";
import {
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Select,
  message,
  Popconfirm,
} from "antd";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";

const { Option } = Select;

export default function AttenOt() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [otRecords, setOtRecords] = useState([]);

  const [departments] = useState([
    "Finance",
    "Application Development",
    "IT Department",
    "Web Development",
    "Sales",
    "UI / UX",
    "Account Management",
    "Marketing",
  ]);

  const [employees] = useState([
    { id: "EMP001", name: "John Doe" },
    { id: "EMP002", name: "Jane Smith" },
    { id: "EMP003", name: "Robert Lee" },
    { id: "EMP004", name: "Sophia Patel" },
    { id: "EMP005", name: "Michael Brown" },
  ]);

  const showModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    if (record) {
      form.setFieldsValue({
        ...record,
        date: dayjs(record.date, "YYYY-MM-DD"),
        startTime: dayjs(record.startTime, "HH:mm"),
        endTime: dayjs(record.endTime, "HH:mm"),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Pending" });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const calculateOtHours = (start, end) => {
    let diff = end.diff(start, "minute");
    if (diff < 0) diff += 24 * 60;
    return (diff / 60).toFixed(2);
  };

  const handleSubmit = (values) => {
    const startTime = values.startTime;
    const endTime = values.endTime;
    const otHours = calculateOtHours(startTime, endTime);

    const formattedRecord = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
      otHours,
    };

    if (Array.isArray(values.employeeId) && values.employeeId.length > 1) {
      const newRecords = values.employeeId.map((empId, index) => ({
        key: `${empId}-${values.date}`,
        employeeId: empId,
        employeeName:
          employees.find((e) => e.id === empId)?.name || values.employeeName[index],
        department: values.department,
        date: formattedRecord.date,
        startTime: formattedRecord.startTime,
        endTime: formattedRecord.endTime,
        otHours: formattedRecord.otHours,
        status: formattedRecord.status,
      }));
      setOtRecords([...otRecords, ...newRecords]);
    } else {
      const newRecord = {
        key: editingRecord ? editingRecord.key : `${values.employeeId}-${values.date}`,
        employeeId: Array.isArray(values.employeeId)
          ? values.employeeId[0]
          : values.employeeId,
        employeeName: Array.isArray(values.employeeName)
          ? values.employeeName[0]
          : values.employeeName,
        department: values.department,
        date: formattedRecord.date,
        startTime: formattedRecord.startTime,
        endTime: formattedRecord.endTime,
        otHours: formattedRecord.otHours,
        status: formattedRecord.status,
      };

      if (editingRecord) {
        setOtRecords(
          otRecords.map((r) =>
            r.key === editingRecord.key ? { ...r, ...newRecord } : r
          )
        );
      } else {
        setOtRecords([...otRecords, newRecord]);
      }
    }

    message.success(
      editingRecord ? "OT Record updated successfully" : "OT Record added successfully"
    );
    handleCancel();
  };


  const handleDelete = (key) => {
    setOtRecords(otRecords.filter((r) => r.key !== key));
    message.success("OT Record deleted successfully");
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="font-semibold text-xl mb-5">Overtime Management</h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => showModal()}
          className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition transform"
        >
          Add OT
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-100 p-3 text-left">Employee ID</th>
              <th className="border border-gray-100 p-3 text-left">Employee Name</th>
              <th className="border border-gray-100 p-3 text-left">Department</th>
              <th className="border border-gray-100 p-3 text-center">Date</th>
              <th className="border border-gray-100 p-3 text-center">Start Time</th>
              <th className="border border-gray-100 p-3 text-center">End Time</th>
              <th className="border border-gray-100 p-3 text-center">OT Hours</th>
              <th className="border border-gray-100 p-3 text-center">Status</th>
              <th className="border border-gray-100 p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {otRecords.length > 0 ? (
              otRecords.map((r) => (
                <tr
                  key={r.key}
                  className="hover:bg-gray-50 text-gray-700 transition duration-150"
                >
                  <td className="border border-gray-200 p-3 font-semibold text-[#408CFF]">
                    {r.employeeId}
                  </td>
                  <td className="border border-gray-200 p-3">{r.employeeName}</td>
                  <td className="border border-gray-200 p-3">{r.department}</td>
                  <td className="border border-gray-200 p-3 text-center">
                    {dayjs(r.date).format("DD-MM-YYYY")}
                  </td>
                  <td className="border border-gray-200 p-3 text-center">{r.startTime}</td>
                  <td className="border border-gray-200 p-3 text-center">{r.endTime}</td>
                  <td className="border border-gray-200 p-3 text-center font-bold">
                    {r.otHours} Hrs
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        r.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : r.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="border border-gray-200 p-3 text-center space-x-2">
                    <button
                      className="px-3 py-1 bg-gray-100 rounded shadow hover:bg-gray-200 transition"
                      onClick={() => showModal(r)}
                    >
                      <FaPencilAlt />
                    </button>
                    <Popconfirm
                      title="Are you sure to delete this record?"
                      onConfirm={() => handleDelete(r.key)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition">
                        <FaTrash />
                      </button>
                    </Popconfirm>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 italic p-6">
                  No OT records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title={editingRecord ? "Edit OT Record" : "Add OT Record"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "Pending" }}
        >

          <Form.Item
            label="Employee ID"
            name="employeeId"
            rules={[{ required: true, message: "Please select employee ID" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select Employee IDs"
              showSearch
              optionFilterProp="children"
            >
              {employees.map((emp) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.id}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Employee Name"
            name="employeeName"
            rules={[{ required: true, message: "Please select employee name" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select Employee Names"
              showSearch
              optionFilterProp="children"
            >
              {employees.map((emp) => (
                <Option key={emp.name} value={emp.name}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select placeholder="Select Department" showSearch>
              {departments.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Start Time" name="startTime" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="End Time" name="endTime" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition transform"
            >
              {editingRecord ? "Update OT" : "Add OT"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
