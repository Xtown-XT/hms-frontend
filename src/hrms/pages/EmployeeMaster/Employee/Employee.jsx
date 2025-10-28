
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  message,
  Select,
  Modal,
  Space,
  Card,
  Form,
  DatePicker,
  Upload,
  Avatar,
  Popconfirm,

} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import EmployeeApi from "./EmployeeApi";

const { Option } = Select;

const Employee = () => {
  const navigate = useNavigate();
  const primaryColor = "#10b981";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch Employees
  // const fetchEmployees = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await EmployeeApi.getAll();
  //     setEmployees(res.data?.employees || []);
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Failed to load employees");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
// ✅ Fixed Fetch Employees function

useEffect(() => {
  fetchEmployees();
}, []);

// const fetchEmployees = async () => {
//   try {
//     setLoading(true);
//     const res = await EmployeeApi.getAll();
//     console.log("✅ Employee list response:", res.data);

//     // handle backend response safely
//     if (Array.isArray(res.data)) setEmployees(res.data);
//     else if (Array.isArray(res.data?.employees)) setEmployees(res.data.employees);
//     else if (Array.isArray(res.data?.data)) setEmployees(res.data.data);
//     else setEmployees([]);

//   } catch (err) {
//     console.error("❌ Error fetching employees:", err);
//     message.error(err.response?.data?.message || "Failed to fetch employees");
//   } finally {
//     setLoading(false);
//   }
// };

const fetchEmployees = async () => {
  try {
    setLoading(true);
    const res = await EmployeeApi.getAll();
    console.log("✅ Employee list response:", res.data);

    // ✅ Fix here: use `rows`
    if (Array.isArray(res.data?.rows)) setEmployees(res.data.rows);
    else if (Array.isArray(res.data)) setEmployees(res.data);
    else if (Array.isArray(res.data?.employees)) setEmployees(res.data.employees);
    else if (Array.isArray(res.data?.data)) setEmployees(res.data.data);
    else setEmployees([]);

  } catch (err) {
    console.error("❌ Error fetching employees:", err);
    message.error(err.response?.data?.message || "Failed to fetch employees");
  } finally {
    setLoading(false);
  }
};


  const handleAdd = async (values) => {
  setLoading(true);

  const formData = new FormData();

  // ✅ Add only fields that exist in backend
  formData.append("first_name", values.first_name);
  formData.append("last_name", values.last_name);
  formData.append("date_of_joining", values.date_of_joining.format("YYYY-MM-DD"));
  formData.append("reporting_manager", values.reporting_manager);
  formData.append("employee_type", values.employee_type);
  formData.append("shift_type", values.shift_type);
  formData.append("status", values.status);

  // ✅ Add profile image if selected
  if (values.profile_picture?.file) {
    formData.append("profile_picture", values.profile_picture.file);
  }

  try {
    const res = await EmployeeApi.create(formData);
    message.success(res.data.message);
    setAddModalVisible(false);
    form.resetFields();
  } catch (err) {
    console.error(err);
    message.error(err.response?.data?.message || "Failed to add employee");
  } finally {
    setLoading(false);
  }
};


  // Edit Employee
  const handleEdit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        dateOfJoining: values.dateOfJoining
          ? values.dateOfJoining.format("YYYY-MM-DD")
          : null,
        profileImage: profileImage || editingEmployee?.profileImage,
      };
      await EmployeeApi.update(editingEmployee._id, payload);
      message.success("Employee updated successfully");
      setEditModalVisible(false);
      setProfileImage(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      message.error("Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  // Delete Employee
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await EmployeeApi.delete(id);
      message.success("Employee deleted successfully");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status === "inactive"
  ).length;
  const newJoiners = employees.filter(
    (e) =>
      e.dateOfJoining &&
      moment().diff(moment(e.dateOfJoining), "days") <= 30
  ).length;

  const dynamicStats = [
    { title: "Total Employees", value: totalEmployees, color: "bg-black" },
    { title: "Active", value: activeEmployees, color: "bg-green-500" },
    { title: "Inactive", value: inactiveEmployees, color: "bg-red-500" },
    { title: "New Joiners", value: newJoiners, color: "bg-blue-500" },
  ];

  // Table Columns
  // const columns = [
  //   { title: "S.No", render: (_, __, i) => i + 1 },
  //   {
  //     title: "Profile",
  //     dataIndex: "profileImage",
  //     render: (src) => (
  //       <Avatar src={src} icon={!src && <UserOutlined />} size={40} />
  //     ),
  //   },
  //   {
  //     title: "Employee ID",
  //     dataIndex: "employeeId",
  //     render: (id, record) => (
  //       <span
  //         style={{
  //           color: primaryColor,
  //           cursor: "pointer",
  //           textDecoration: "underline",
  //         }}
  //         onClick={() =>
  //           navigate(`/hrms/pages/employee/${record._id}`, {
  //             state: { employee: record },
  //           })
  //         }
  //       >
  //         {id}
  //       </span>
  //     ),
  //   },
  //   { title: "Name", render: (_, record) => `${record.firstName} ${record.lastName}` },
  //   { title: "Reporting Manager", dataIndex: "reportingManager" },
  //   { title: "Employee Type", dataIndex: "employeeType" },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     render: (s) => (
  //       <Tag color={s === "active" ? "green" : "red"}>{s}</Tag>
  //     ),
  //   },
  //   { title: "Shift Type", dataIndex: "shiftType" },
  //   {
  //     title: "Actions",
  //     render: (_, record) => (
  //       <Space>
  //         <Button
  //           icon={<EditOutlined />}
  //           onClick={() => {
  //             setEditingEmployee(record);
  //             editForm.setFieldsValue({
  //               ...record,
  //               dateOfJoining: record.dateOfJoining
  //                 ? moment(record.dateOfJoining)
  //                 : null,
  //             });
  //             setProfileImage(record.profileImage || null);
  //             setEditModalVisible(true);
  //           }}
  //         />
  //         <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
  //           <Button danger icon={<DeleteOutlined />} />
  //         </Popconfirm>
  //       </Space>
  //     ),
  //   },
  // ];

   const columns = [
    { title: "S.No", render: (_, __, i) => i + 1 },
    {
      title: "Profile",
      dataIndex: "profileImage",
      render: (src) => (
        <Avatar src={src} icon={!src && <UserOutlined />} size={40} />
      ),
    },
    {
      title: "Employee ID",
      dataIndex: "emp_id",
      render: (id, record) => (
        <span
          style={{
            color: primaryColor,
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() =>
            navigate(`/hrms/pages/employee/${record._id}`, {
              state: { employee: record },
            })
          }
        >
          {id}
        </span>
      ),
    },
    {
      title: "Name",
      render: (_, record) => `${record.first_name || ""} ${record.last_name || ""}`,
    },
    { title: "Reporting Manager", dataIndex: "reporting_manager" },
    { title: "Employee Type", dataIndex: "employee_type" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "active" ? "green" : "red"}>{s}</Tag>
      ),
    },
    { title: "Shift Type", dataIndex: "shift_type" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingEmployee(record);
              setProfileImage(record.profileImage || null);
              setEditModalVisible(true);
            }}
          />
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div className="bg-white p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {dynamicStats.map((s) => (
          <Card key={s.title} className="flex flex-row items-center gap-3 shadow">
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center ${s.color}`}
            >
              <UserOutlined className="text-white text-xl" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600">{s.title}</div>
              <div className="text-xl font-bold">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-xl">Employee</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddModalVisible(true)}
        >
          Add Employee
        </Button>
      </div>

      {/* <Table
        columns={columns}
        dataSource={employees}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      /> */}

       <div>
      <Table
        columns={columns}
        dataSource={employees}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>

      {/* Add Employee Modal */}
      <Modal
        title="Add Employee"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="profile_picture" label="Profile Picture">
            <div className="flex items-center gap-4">
              <div
                className="relative rounded-full flex items-center justify-center overflow-hidden bg-gray-100"
                style={{ width: 64, height: 64 }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserOutlined style={{ fontSize: 28, color: "#bfbfbf" }} />
                )}

                {profileImage && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-white bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                    <Upload
                      beforeUpload={(file) => {
                        setProfileImage(URL.createObjectURL(file));
                        return false;
                      }}
                      showUploadList={false}
                    >
                      <EditOutlined
                        style={{ fontSize: 18, color: "gray", cursor: "pointer" }}
                      />
                    </Upload>
                    <DeleteOutlined
                      style={{ fontSize: 18, color: "gray", cursor: "pointer" }}
                      onClick={() => setProfileImage(null)}
                    />
                  </div>
                )}
              </div>

              {!profileImage && (
                <Upload
                  beforeUpload={(file) => {
                    setProfileImage(URL.createObjectURL(file));
                    return false;
                  }}
                  showUploadList={false}
                >
                  <UploadOutlined
                    style={{ fontSize: 22, color: "#1890ff", cursor: "pointer" }}
                  />
                </Upload>
              )}
            </div>
          </Form.Item>

          {/* Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="emp_id" label="Employee ID">
              <Input />
            </Form.Item>
            <Form.Item name="attendance_id" label="Attendance ID">
              <Input />
            </Form.Item>
            <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="date_of_joining" label="Date of Joining" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="reporting_manager" label="Reporting Manager" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="employee_type" label="Employee Type" rules={[{ required: true }]}>
              <Select placeholder="Select Type">
                <Option value="permanent">Permanent</Option>
                <Option value="contract">Contract</Option>
                <Option value="intern">Intern</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Select Status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="shift_type"
              label="Shift Type"
              rules={[{ required: true, message: "Please select a shift type" }]}
            >
              <Select placeholder="Select Shift Type">
                <Option value="day">Day Shift</Option>
                <Option value="night">Night Shift</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="flex justify-end gap-2">
            <Button onClick={() => setAddModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        title="Edit Employee"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item label="Profile Picture">
            {!profileImage ? (
              <Upload
                beforeUpload={(file) => {
                  setProfileImage(URL.createObjectURL(file));
                  return false;
                }}
                showUploadList={false}
              >
                <Button type="primary">Upload</Button>
              </Upload>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                <img
                  src={profileImage}
                  alt="profile"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
                <Button danger onClick={() => setProfileImage(null)}>
                  Remove
                </Button>
              </div>
            )}
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="attendanceId" label="Attendance ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="reportingManager" label="Reporting Manager" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="employeeType" label="Employee Type" rules={[{ required: true }]}>
              <Select placeholder="Select Type">
                <Option value="permanent">Permanent</Option>
                <Option value="contract">Contract</Option>
                <Option value="intern">Intern</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Select Status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="shiftType"
              label="Shift Type"
              rules={[{ required: true, message: "Please select a shift type" }]}
            >
              <Select placeholder="Select Shift Type">
                <Option value="day">Day Shift</Option>
                <Option value="night">Night Shift</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="flex justify-end gap-2">
            <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;
