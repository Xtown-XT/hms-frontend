// import React, { useState } from "react";
// import {
//   Table,
//   Button,
//   Select,
//   Tag,
//   Space,
//   Input,
//   Dropdown,
//   Menu,
//   Modal,
//   Form,
//   InputNumber,
//   message,
// } from "antd";
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   DownOutlined,
//   ExportOutlined,
// } from "@ant-design/icons";

// const { Search } = Input;

// export default function Departments() {
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [departments, setDepartments] = useState([
  
//   ]);

//   const [form] = Form.useForm();

//   const handleAdd = (values) => {
//     const newDept = {
//       key: departments.length + 1,
//       name: values.name,
//       employees: values.employees,
//       status: values.status,
//     };
//     setDepartments([...departments, newDept]);
//     setIsModalOpen(false);
//     form.resetFields();
//     message.success("Department added successfully!");
//   };

//   // ✅ EXPORT TO CSV FUNCTION
//   const handleExport = () => {
//     const csvHeader = ["Department", "No of Employees", "Status"];
//     const csvRows = departments.map((d) => [d.name, d.employees, d.status]);

//     const csvContent = [
//       csvHeader.join(","),
//       ...csvRows.map((r) => r.join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "departments.csv");
//     link.click();
//     message.success("Exported departments.csv successfully!");
//   };

//   const filteredData =
//     statusFilter === "All"
//       ? departments
//       : departments.filter((item) => item.status === statusFilter);

//   const columns = [
//     {
//       title: "Department",
//       dataIndex: "name",
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
    
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => (
//         <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
//       ),
//       filters: [
//         { text: "Active", value: "Active" },
//         { text: "Inactive", value: "Inactive" },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: "Actions",
//       render: () => (
//         <Space>
//           <Button
//             type="text"
//             icon={<EditOutlined />}
//             className="text-blue-500 hover:text-blue-700"
//           />
//           <Button
//             type="text"
//             icon={<DeleteOutlined />}
//             className="text-red-500 hover:text-red-700"
//           />
//         </Space>
//       ),
//     },
//   ];

//   const menu = (
//     <Menu
//       items={[
//         { label: "Last 7 Days", key: "7" },
//         { label: "Last 30 Days", key: "30" },
//         { label: "All Time", key: "all" },
//       ]}
//     />
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <div>
          
//           <p className="text-sm text-gray-500">Employee / Departments</p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* ✅ Export button */}
//           {/* <Button icon={<ExportOutlined />} onClick={handleExport}>
//             Export
//           </Button> */}

//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             className="bg-orange-500 hover:bg-orange-600"
//             onClick={() => setIsModalOpen(true)}
//           >
//             Add Department
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4">
//         <h2 className="font-semibold text-xl">Department List</h2>

//         <div className="flex flex-wrap gap-2 items-center">
//           <Select
//             defaultValue="All"
//             onChange={setStatusFilter}
//             style={{ width: 120 }}
//             options={[
//               { value: "All", label: "Status" },
//               { value: "Active", label: "Active" },
//               { value: "Inactive", label: "Inactive" },
//             ]}
//           />
//           <Dropdown overlay={menu} trigger={["click"]}>
//             <Button>
//               Sort By: Last 7 Days <DownOutlined />
//             </Button>
//           </Dropdown>
//           <Search placeholder="Search" style={{ width: 200 }} />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <Table
//           columns={columns}
//           dataSource={filteredData}
//           pagination={{ pageSize: 10 }}
//           rowSelection={{}}
//         />
//       </div>

//       {/* Add Department Modal */}
//       <Modal
//         title="Add Department"
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//       >
//         <Form layout="vertical" form={form} onFinish={handleAdd}>
//           {/* 🔽 Department Dropdown */}
//           <Form.Item
//             name="name"
//             label="Department Name"
//             rules={[{ required: true, message: "Please select department name" }]}
//           >
//             <Select
//               placeholder="Select Department"
//               options={[
//                 { value: "Finance", label: "Finance" },
//                 { value: "Application Development", label: "Application Development" },
//                 { value: "IT Management", label: "IT Management" },
//                 { value: "Web Development", label: "Web Development" },
//                 { value: "Sales", label: "Sales" },
//                 { value: "UI / UX", label: "UI / UX" },
//                 { value: "Account Management", label: "Account Management" },
//                 { value: "Marketing", label: "Marketing" },
//               ]}
//             />
//           </Form.Item>

          

//           <Form.Item
//             name="status"
//             label="Status"
//             rules={[{ required: true, message: "Please select status" }]}
//           >
//             <Select
//               placeholder="Select status"
//               options={[
//                 { value: "Active", label: "Active" },
//                 { value: "Inactive", label: "Inactive" },
//               ]}
//             />
//           </Form.Item>

//           <div className="flex justify-end gap-2 mt-4">
//             <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
//             <Button type="primary" htmlType="submit" className="bg-orange-500">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// }
// src/hrms/pages/Department/Departments.js
import React, { useState, useEffect } from "react";
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
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
} from "@ant-design/icons";
import DepartmentApi from "../Department/Department";

const { Search } = Input;

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // ✅ Get All Departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await DepartmentApi.getAll();
      if (res?.data?.success) {
        setDepartments(res.data.data || []);
      } else {
        message.error(res.data.message || "Failed to fetch departments");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ Get by ID
  const fetchDepartmentById = async (id) => {
    try {
      const res = await DepartmentApi.getById(id);
      if (res?.data?.success) {
        return res.data.data;
      } else {
        message.error(res.data.message || "Failed to get department");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching department by ID");
    }
  };

  // ✅ Create Department
  const handleAdd = async (values) => {
    try {
      const res = await DepartmentApi.create(values);
      if (res?.data?.success) {
        message.success("Department added successfully!");
        setIsAddModalOpen(false);
        form.resetFields();
        fetchDepartments();
      } else {
        message.error(res.data.message || "Failed to add department");
      }
    } catch (error) {
      console.error(error);
      message.error("Error adding department");
    }
  };

  // ✅ Update Department
  const handleEdit = async (values) => {
    try {
      const res = await DepartmentApi.update(currentDept.id, values);
      if (res?.data?.success) {
        message.success("Department updated successfully!");
        setIsEditModalOpen(false);
        editForm.resetFields();
        fetchDepartments();
      } else {
        message.error(res.data.message || "Failed to update department");
      }
    } catch (error) {
      console.error(error);
      message.error("Error updating department");
    }
  };

  // ✅ Delete Department
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this department?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await DepartmentApi.delete(id);
          if (res?.data?.success) {
            message.success("Department deleted successfully!");
            fetchDepartments();
          } else {
            message.error(res.data.message || "Failed to delete department");
          }
        } catch (error) {
          console.error(error);
          message.error("Error deleting department");
        }
      },
    });
  };

  const filteredData =
    statusFilter === "All"
      ? departments
      : departments.filter((item) => item.status === statusFilter);

  const columns = [
    {
      title: "Department",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={async () => {
              const dept = await fetchDepartmentById(record.id);
              setCurrentDept(dept);
              editForm.setFieldsValue({
                name: dept.name,
                status: dept.status,
              });
              setIsEditModalOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
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
        <p className="text-sm text-gray-500">Employee / Departments</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Department
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4">
        <h2 className="font-semibold text-xl">Department List</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            defaultValue="All"
            onChange={setStatusFilter}
            style={{ width: 120 }}
            options={[
              { value: "All", label: "Status" },
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
          rowKey="id"
          loading={loading}
        />
      </div>

      {/* Add Modal */}
      <Modal
        title="Add Department"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Department Name"
            rules={[{ required: true, message: "Please enter department name" }]}
          >
            <Input placeholder="Enter department name" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-orange-500">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Department"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={editForm} onFinish={handleEdit}>
          <Form.Item
            name="name"
            label="Department Name"
            rules={[{ required: true, message: "Please enter department name" }]}
          >
            <Input placeholder="Enter department name" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-orange-500">
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
