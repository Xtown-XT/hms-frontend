import React, { useState } from "react";
import {
  Table,
  Button,
  Select,
  Tag,
  Space,
  Input,
  Dropdown,
  Menu,
  Modal,
  Form,
  InputNumber,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  ExportOutlined,
} from "@ant-design/icons";

const { Search } = Input;

export default function Designations() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [designations, setDesignations] = useState([
   
  ]);

  const handleAdd = (values) => {
    const newItem = {
      key: designations.length + 1,
      name: values.name,
      department: values.department,
      employees: values.employees,
      status: values.status,
    };
    setDesignations([...designations, newItem]);
    setIsModalOpen(false);
    form.resetFields();
    message.success("Designation added successfully!");
  };

  // ✅ Export to CSV
  const handleExport = () => {
    const csvHeader = ["Designation", "Department", "No of Employees", "Status"];
    const csvRows = designations.map((d) => [
      d.name,
      d.department,
      d.employees,
      d.status,
    ]);
    const csvContent = [csvHeader.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "designations.csv");
    link.click();
    message.success("Exported designations.csv successfully!");
  };

  const filteredData =
    statusFilter === "All"
      ? designations
      : designations.filter((item) => item.status === statusFilter);

  const columns = [
    {
      title: "Designation",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: "No of Employees",
      dataIndex: "employees",
      sorter: (a, b) => a.employees - b.employees,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      render: () => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            className="text-blue-500 hover:text-blue-700"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:text-red-700"
          />
        </Space>
      ),
    },
  ];

  const menu = (
    <Menu
      items={[
        { label: "Last 7 Days", key: "7" },
        { label: "Last 30 Days", key: "30" },
        { label: "All Time", key: "all" },
      ]}
    />
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Employee / Designations</p>
        </div>

        <div className="flex items-center gap-3">
          {/* <Button icon={<ExportOutlined />} onClick={handleExport}>
            Export
          </Button> */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsModalOpen(true)}
          >
            Add Designation
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4">
        <h2 className="font-semibold text-xl">Designation List</h2>

        <div className="flex flex-wrap gap-2 items-center">
          <Select
            placeholder="Department"
            style={{ width: 150 }}
            options={[
              { value: "All", label: "Department" },
              { value: "Finance", label: "Finance" },
              { value: "Application Development", label: "Application Development" },
              { value: "IT Management", label: "IT Management" },
              { value: "Web Development", label: "Web Development" },
              { value: "Sales", label: "Sales" },
              { value: "UI / UX", label: "UI / UX" },
              { value: "Marketing", label: "Marketing" },
            ]}
          />

          <Select
            defaultValue="All"
            onChange={setStatusFilter}
            style={{ width: 150 }}
            options={[
              { value: "All", label: "Select Status" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />

          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
              Sort By: Last 7 Days <DownOutlined />
            </Button>
          </Dropdown>

          <Search placeholder="Search" style={{ width: 200 }} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          rowSelection={{}}
        />
      </div>

      {/* Add Designation Modal */}
      <Modal
        title="Add Designation"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Designation"
            rules={[{ required: true, message: "Please enter designation name" }]}
          >
            <Input placeholder="Enter designation name" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select
              placeholder="Select department"
              options={[
                { value: "Finance", label: "Finance" },
                { value: "Application Development", label: "Application Development" },
                { value: "IT Management", label: "IT Management" },
                { value: "Web Development", label: "Web Development" },
                { value: "Sales", label: "Sales" },
                { value: "UI / UX", label: "UI / UX" },
                { value: "Account Management", label: "Account Management" },
                { value: "Marketing", label: "Marketing" },
              ]}
            />
          </Form.Item>

          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder="Select status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-orange-500">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
