import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Button, Popconfirm, TimePicker, Select } from "antd";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import dayjs from "dayjs";

export default function AttenOt() {
  const [otRecords, setOtRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
   const [form] = Form.useForm();

  const showModal = (index = null) => {
    setEditingIndex(index);
    setIsModalOpen(true);


    if (index !== null) {

      const record = otRecords[index];
      form.setFieldsValue({
        ...record,
        date: dayjs(record.date, "DD-MM-YYYY"),
        startTime: dayjs(record.startTime, "hh:mm A"),
        endTime: dayjs(record.endTime, "hh:mm A"),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Pending" });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
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

    const newRecord = {
      ...values,
      date: values.date.format("DD-MM-YYYY"),
      startTime: startTime.format("hh:mm A"),
      endTime: endTime.format("hh:mm A"),
      otHours,
    };

    if (editingIndex !== null) {
    
      const updatedRecords = [...otRecords];
      updatedRecords[editingIndex] = newRecord;
      setOtRecords(updatedRecords);
    } else {
        setOtRecords([...otRecords, newRecord]);
    }

    handleCancel();
  };

  const deleteRecord = (index) => {
    const updatedRecords = [...otRecords];
    updatedRecords.splice(index, 1);
    setOtRecords(updatedRecords);
  };

 
  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="font-semibold text-xl">
        Overtime Management
      </h1>

      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          className="bg-gradient-to-r from-[#408CFF] to-[#EF4CFF] text-white"
          onClick={() => showModal()}
        >
          Add OT
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-100 p-4 text-left">Employee ID</th>
              <th className="border border-gray-100 p-4 text-left">Employee Name</th>
              <th className="border border-gray-100 p-4 text-center">Start Time</th>
              <th className="border border-gray-100 p-4 text-center">End Time</th>
              <th className="border border-gray-100 p-4 text-center">OT Hours</th>
              <th className="border border-gray-100 p-4 text-center">Date</th>
              <th className="border border-gray-100 p-4 text-center">Status</th>
              <th className="border border-gray-100 p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {otRecords.length > 0 ? (
              otRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-gray-700 transition duration-150">
                  <td className="border border-gray-200 p-3 font-semibold text-[#408CFF]">
                    {r.employeeId}
                  </td>
                  <td className="border border-gray-200 p-3">{r.employeeName}</td>
                  <td className="border border-gray-200 p-3 text-center">{r.startTime}</td>
                  <td className="border border-gray-200 p-3 text-center">{r.endTime}</td>
                  <td className="border border-gray-200 p-3 text-center font-bold">{r.otHours} Hrs</td>
                  <td className="border border-gray-200 p-3 text-center">{r.date}</td>
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
                    <Button
                      type="default"
                      className="bg-gradient-to-r from-[#408CFF] to-[#EF4CFF] text-white"
                      size="small"
                      icon={<FaPencilAlt />}
                      onClick={() => showModal(idx)}
                    />
                    <Popconfirm
                      title="Are you sure to delete this record?"
                      onConfirm={() => deleteRecord(idx)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="default" size="small" danger icon={<FaTrash />} />
                    </Popconfirm>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 italic p-6">
                  No OT records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <Modal
        title={editingIndex !== null ? "Edit OT Entry" : "Add OT Entry"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "Pending" }}>
          <Form.Item label="Employee ID" name="employeeId" rules={[{ required: true }]}>
            <Input placeholder="Enter Employee ID" disabled={editingIndex !== null} />
          </Form.Item>

          <Form.Item label="Employee Name" name="employeeName" rules={[{ required: true }]}>
            <Input placeholder="Enter Employee Name" />
          </Form.Item>

          <Form.Item label="Start Time" name="startTime" rules={[{ required: true }]}>
            <TimePicker format="hh:mm A" use12Hours className="w-full" />
          </Form.Item>

          <Form.Item label="End Time" name="endTime" rules={[{ required: true }]}>
            <TimePicker format="hh:mm A" use12Hours className="w-full" />
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
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
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
