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

// export default function Designations() {
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form] = Form.useForm();

//   const [designations, setDesignations] = useState([
   
//   ]);

//   const handleAdd = (values) => {
//     const newItem = {
//       key: designations.length + 1,
//       name: values.name,
//       department: values.department,
//       employees: values.employees,
//       status: values.status,
//     };
//     setDesignations([...designations, newItem]);
//     setIsModalOpen(false);
//     form.resetFields();
//     message.success("Designation added successfully!");
//   };

//   // ✅ Export to CSV
//   const handleExport = () => {
//     const csvHeader = ["Designation", "Department", "No of Employees", "Status"];
//     const csvRows = designations.map((d) => [
//       d.name,
//       d.department,
//       d.employees,
//       d.status,
//     ]);
//     const csvContent = [csvHeader.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "designations.csv");
//     link.click();
//     message.success("Exported designations.csv successfully!");
//   };

//   const filteredData =
//     statusFilter === "All"
//       ? designations
//       : designations.filter((item) => item.status === statusFilter);

//   const columns = [
//     {
//       title: "Designation",
//       dataIndex: "name",
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
//     {
//       title: "Department",
//       dataIndex: "department",
//       sorter: (a, b) => a.department.localeCompare(b.department),
//     },
//     {
//       title: "No of Employees",
//       dataIndex: "employees",
//       sorter: (a, b) => a.employees - b.employees,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => (
//         <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
//       ),
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
//           <p className="text-sm text-gray-500">Employee / Designations</p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* <Button icon={<ExportOutlined />} onClick={handleExport}>
//             Export
//           </Button> */}
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             className="bg-orange-500 hover:bg-orange-600"
//             onClick={() => setIsModalOpen(true)}
//           >
//             Add Designation
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4">
//         <h2 className="font-semibold text-xl">Designation List</h2>

//         <div className="flex flex-wrap gap-2 items-center">
//           <Select
//             placeholder="Department"
//             style={{ width: 150 }}
//             options={[
//               { value: "All", label: "Department" },
//               { value: "Finance", label: "Finance" },
//               { value: "Application Development", label: "Application Development" },
//               { value: "IT Management", label: "IT Management" },
//               { value: "Web Development", label: "Web Development" },
//               { value: "Sales", label: "Sales" },
//               { value: "UI / UX", label: "UI / UX" },
//               { value: "Marketing", label: "Marketing" },
//             ]}
//           />

//           <Select
//             defaultValue="All"
//             onChange={setStatusFilter}
//             style={{ width: 150 }}
//             options={[
//               { value: "All", label: "Select Status" },
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

//       {/* Add Designation Modal */}
//       <Modal
//         title="Add Designation"
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//       >
//         <Form layout="vertical" form={form} onFinish={handleAdd}>
//           <Form.Item
//             name="name"
//             label="Designation"
//             rules={[{ required: true, message: "Please enter designation name" }]}
//           >
//             <Input placeholder="Enter designation name" />
//           </Form.Item>

//           <Form.Item
//             name="department"
//             label="Department"
//             rules={[{ required: true, message: "Please select department" }]}
//           >
//             <Select
//               placeholder="Select department"
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
// src/hrms/pages/Role/Designations.jsx
// src/hrms/pages/Designations/Designations.js
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Tag,
  Space,
  Input,
  Modal,
  Form,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import RoleApi from "../Designation/Designation";

const { Search } = Input;

export default function Designations() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDesignation, setCurrentDesignation] = useState(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // ✅ Fetch all designations
  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const res = await RoleApi.getAll();
      setDesignations(res.data?.roles || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch designations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  // ✅ Add designation
  const handleAdd = async (values) => {
    try {
      setLoading(true);
      const res = await RoleApi.create(values);
      if (res.data?.success) {
        message.success("Designation added successfully!");
        setIsModalOpen(false);
        form.resetFields();
        fetchDesignations();
      } else {
        message.error(res.data.message || "Failed to add designation");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to add designation");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit designation
  const handleEdit = async (values) => {
    try {
      setLoading(true);
      const res = await RoleApi.update(currentDesignation._id, values);
      if (res.data?.success) {
        message.success("Designation updated successfully!");
        setIsEditModalOpen(false);
        editForm.resetFields();
        fetchDesignations();
      } else {
        message.error(res.data.message || "Failed to update designation");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to update designation");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete designation
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this designation?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          setLoading(true);
          const res = await RoleApi.delete(id);
          if (res.data?.success) {
            message.success("Designation deleted successfully!");
            fetchDesignations();
          } else {
            message.error(res.data.message || "Failed to delete designation");
          }
        } catch (err) {
          console.error(err);
          message.error("Failed to delete designation");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const filteredData =
    statusFilter === "All"
      ? designations
      : designations.filter((item) => item.status === statusFilter);

  const columns = [
    { title: "Designation", dataIndex: "name", key: "name" },
    { title: "Department", dataIndex: "department", key: "department" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentDesignation(record);
              editForm.setFieldsValue({
                name: record.name,
                department: record.department,
                status: record.status,
              });
              setIsEditModalOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Employee / Designations</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsModalOpen(true)}
        >
          Add Designation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4">
        <h2 className="font-semibold text-xl">Designation List</h2>
        <div className="flex flex-wrap gap-2 items-center">
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
          <Search placeholder="Search" style={{ width: 200 }} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
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
            <Select placeholder="Select department" />
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

      {/* Edit Designation Modal */}
      <Modal
        title="Edit Designation"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={editForm} onFinish={handleEdit}>
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
            <Select placeholder="Select department" />
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
