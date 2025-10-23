import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, Popconfirm, TimePicker } from "antd";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import dayjs from "dayjs";

export default function AttenOd() {
  const [odRecords, setOdRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const showModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    if (record) {
      form.setFieldsValue({
        ...record,
        odDate: dayjs(record.odDate, "DD/MM/YYYY"),
        startTime: dayjs(record.startTime, "hh:mm A"),
        endTime: dayjs(record.endTime, "hh:mm A"),
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const calculateTotalHours = (start, end) => {
    let diff = end.diff(start, "minute"); // in minutes
    if (diff < 0) diff += 24 * 60; // Handle next day
    return (diff / 60).toFixed(2); // Decimal format
  };

  const handleSubmit = (values) => {
    const startTime = values.startTime;
    const endTime = values.endTime;
    const totalHours = calculateTotalHours(startTime, endTime);

    const record = {
      ...values,
      odDate: values.odDate.format("DD/MM/YYYY"),
      startTime: startTime.format("hh:mm A"),
      endTime: endTime.format("hh:mm A"),
      totalHours,
    };

    if (editingRecord) {
      setOdRecords(
        odRecords.map((r) =>
          r.employeeId === editingRecord.employeeId ? record : r
        )
      );
    } else {
      setOdRecords([...odRecords, record]);
    }

    handleCancel();
  };

  const handleDelete = (employeeId) => {
    setOdRecords(odRecords.filter((r) => r.employeeId !== employeeId));
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="font-semibold text-xl">
        On Duty Management
      </h1>

      <div className="mb-4 flex justify-end">
        <Button type="primary" onClick={() => showModal()}>
          Add OD
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-100 p-4 text-left">Employee ID</th>
              <th className="border border-gray-100 p-4 text-left">Employee Name</th>
              <th className="border border-gray-100 p-4 text-center">OD Date</th>
              <th className="border border-gray-100 p-4 text-center">Start Time</th>
              <th className="border border-gray-100 p-4 text-center">End Time</th>
              <th className="border border-gray-100 p-4 text-center">Total Hours</th>
              <th className="border border-gray-100 p-4 text-center">Reason</th>
              <th className="border border-gray-100 p-4 text-center">Status</th>
              <th className="border border-gray-100 p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {odRecords.length > 0 ? (
              odRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-gray-700 transition duration-150">
                  <td className="border border-gray-200 p-3 font-semibold text-[#408CFF]">{r.employeeId}</td>
                  <td className="border border-gray-200 p-3">{r.employeeName}</td>
                  <td className="border border-gray-200 p-3 text-center">{r.odDate}</td>
                  <td className="border border-gray-200 p-3 text-center">{r.startTime}</td>
                  <td className="border border-gray-200 p-3 text-center">{r.endTime}</td>
                  <td className="border border-gray-200 p-3 text-center font-bold">{r.totalHours} Hrs</td>
                  <td className="border border-gray-200 p-3">{r.reason}</td>
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
                    <Button type="default" size="small" icon={<FaPencilAlt />} onClick={() => showModal(r)} />
                    <Popconfirm title="Are you sure to delete this record?" onConfirm={() => handleDelete(r.employeeId)} okText="Yes" cancelText="No">
                      <Button type="default" size="small" danger icon={<FaTrash />} />
                    </Popconfirm>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 italic p-6">
                  No OD records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <Modal
        title={editingRecord ? "Edit OD Record" : "Add OD Record"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "Pending" }}>
          <Form.Item label="Employee ID" name="employeeId" rules={[{ required: true, message: "Please enter Employee ID" }]}>
            <Input placeholder="Enter Employee ID" disabled={!!editingRecord} />
          </Form.Item>

          <Form.Item label="Employee Name" name="employeeName" rules={[{ required: true, message: "Please enter Employee Name" }]}>
            <Input placeholder="Enter Employee Name" />
          </Form.Item>

          <Form.Item label="OD Date" name="odDate" rules={[{ required: true, message: "Please select OD Date" }]}>
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>

          <Form.Item label="Start Time" name="startTime" rules={[{ required: true, message: "Please select Start Time" }]}>
            <TimePicker format="hh:mm A" use12Hours className="w-full" />
          </Form.Item>

          <Form.Item label="End Time" name="endTime" rules={[{ required: true, message: "Please select End Time" }]}>
            <TimePicker format="hh:mm A" use12Hours className="w-full" />
          </Form.Item>

          <Form.Item label="Reason" name="reason" rules={[{ required: true, message: "Please enter reason" }]}>
            <Input placeholder="Enter Reason for OD" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit">
              {editingRecord ? "Update OD" : "Add OD"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
