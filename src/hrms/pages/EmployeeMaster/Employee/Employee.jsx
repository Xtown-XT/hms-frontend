
// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Input,
//   Popover,
//   Dropdown,
//   Menu,
//   Tag,
//   message,
//   Select,
//   Modal,
//   Space,
//   Switch,
//   Card,
//   Form,
//   DatePicker,
//   Upload,
//   Avatar,
// } from "antd";
// import {
//   FilterOutlined,
//   EllipsisOutlined,
//   PlusOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   SettingOutlined,
//   TableOutlined,
//   AppstoreOutlined,
//   UserOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import moment from "moment";

// const { Option } = Select;

// const stats = [
//   { title: "Total Employees", value: 0, color: "bg-black", percent: "0%", percentClass: "text-purple-500" },
//   { title: "Active", value: 0, color: "bg-green-500", percent: "0%", percentClass: "text-red-500" },
//   { title: "Inactive", value: 0, color: "bg-red-500", percent: "-0%", percentClass: "text-gray-500" },
//   { title: "New Joiners", value: 0, color: "bg-blue-500", percent: "0%", percentClass: "text-blue-500" },
// ];

// const FiltersPopover = ({ onApply, companies = [], divisions = [], branches = [], departments = [], designations = [] }) => {
//   const [filters, setFilters] = useState({});
//   const fields = [
//     { key: "divisionId", label: "Division", options: divisions.map((d) => ({ label: d.name, value: d.id })) },
//     { key: "branchId", label: "Branch", options: branches.map((b) => ({ label: b.name, value: b.id })) },
//     { key: "departmentId", label: "Department", options: departments.map((d) => ({ label: d.name, value: d.id })) },
//     { key: "designationId", label: "Designation", options: designations.map((d) => ({ label: d.name, value: d.id })) },
//     { key: "status", label: "Status", options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }] },
//   ];
//   const onChange = (field, value) => setFilters((f) => ({ ...f, [field]: value }));

//   return (
//     <div style={{ padding: 10, width: 240 }}>
//       {fields.map(({ key, label, options }) => (
//         <div key={key} style={{ marginBottom: 12 }}>
//           <Popover
//             content={
//               <>
//                 <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
//                 <Select
//                   allowClear
//                   placeholder={`Select ${label}`}
//                   style={{ width: 200 }}
//                   value={filters[key]}
//                   onChange={(val) => onChange(key, val)}
//                 >
//                   {options.map((o) => (
//                     <Option key={o.value} value={o.value}>
//                       {o.label}
//                     </Option>
//                   ))}
//                 </Select>
//               </>
//             }
//             trigger="hover"
//             placement="right"
//           >
//             <div
//               style={{
//                 cursor: "pointer",
//                 fontWeight: filters[key] ? 600 : 400,
//                 color: filters[key] ? "#1890ff" : undefined,
//               }}
//             >
//               {label}
//               {filters[key] && <span style={{ marginLeft: 4 }}>(1)</span>}
//             </div>
//           </Popover>
//         </div>
//       ))}
//       <Space style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
//         <Button
//           danger
//           size="small"
//           onClick={() => {
//             setFilters({});
//             onApply({});
//           }}
//           disabled={!Object.values(filters).some((v) => v != null)}
//         >
//           Reset
//         </Button>
//         <Button
//           type="primary"
//           size="small"
//           onClick={() => onApply(filters)}
//           disabled={!Object.values(filters).some((v) => v != null)}
//         >
//           Apply
//         </Button>
//       </Space>
//     </div>
//   );
// };

// const Employee = () => {
//   const navigate = useNavigate();
//   const primaryColor = "#10b981";
//   const showCustomButton = true;

//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
//   const [searchText, setSearchText] = useState("");
//   const [filterParams, setFilterParams] = useState({});
//   const [visibleColumns, setVisibleColumns] = useState([
//     "employeeCode",
//     "attendanceId",
//     "firstName",
//     "lastName",
//     "dateOfJoining",
//     "reportingManager",
//     "employeeType",
//     "status",
//     "shiftType",
//     "actions",
//   ]);
//   const [viewMode, setViewMode] = useState("table");
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const [profileImage, setProfileImage] = useState(null);

//   const [companies, setCompanies] = useState([]);
//   const [divisions, setDivisions] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [designations, setDesignations] = useState([]);

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setPagination({ current: 1, pageSize: 10, total: 1 });
//       setLoading(false);
//     }, 500);
//   }, []);

//   // 👇 Modified Employee Code column for navigation
//   const allColumns = [
//     {
//       title: "S.No",
//       key: "serial",
//       render: (_, __, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
//     },
//     {
//       title: "Profile",
//       dataIndex: "profileImage",
//       key: "profile",
//       render: (_, record) => (
//         <Avatar
//           src={record.profileImage}
//           icon={!record.profileImage && <UserOutlined />}
//           style={{
//             backgroundColor: "#EDE9FE",
//             color: primaryColor,
//             cursor: "pointer",
//           }}
//           size={40}
//         />
//       ),
//     },
//     {
//       title: "Employee Code",
//       dataIndex: "employeeCode",
//       key: "employeeCode",
//       render: (code, record) => (
//         <span
//           style={{ color: "#10b981", cursor: "pointer", textDecoration: "underline" }}
//           onClick={() =>
//             navigate(`/hrms/pages/employee/${record.key}`, { state: { employee: record } })
//           }
//         >
//           {code}
//         </span>
//       ),
//     },
//     { title: "Name", dataIndex: "Name", key: "firstName" },
//     { title: "Reporting Manager", dataIndex: "reportingManager", key: "reportingManager" },
//     { title: "Employee Type", dataIndex: "employeeType", key: "employeeType" },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (s) => <Tag color={s === "active" ? "green" : "red"}>{s?.[0].toUpperCase() + s.slice(1)}</Tag>,
//     },
//     { title: "Shift Type", dataIndex: "shiftType", key: "shiftType" },
//     {
//       title: "Actions",
//       key: "actions",
//       render: () => (
//         <Dropdown
//           overlay={
//             <Menu>
//               <Menu.Item key="view" icon={<EyeOutlined />}>View</Menu.Item>
//               <Menu.Item key="edit" icon={<EditOutlined />}>Edit</Menu.Item>
//               <Menu.Item key="delete" icon={<DeleteOutlined />}>Delete</Menu.Item>
//             </Menu>
//           }
//         >
//           <EllipsisOutlined style={{ fontSize: 18, cursor: "pointer", color: primaryColor }} rotate={90} />
//         </Dropdown>
//       ),
//     },
//   ];

//   const columns = allColumns.filter((c) => visibleColumns.includes(c.key));

//   return (
//     <div className="bg-white p-4">
//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         {stats.map((s) => (
//           <Card key={s.title} className="flex flex-row items-center gap-3 shadow">
//             <div className={`rounded-full h-10 w-10 flex items-center justify-center ${s.color}`}>
//               <UserOutlined className="text-white text-xl" />
//             </div>
//             <div>
//               <div className="text-xs font-medium text-gray-600">{s.title}</div>
//               <div className="text-xl font-bold">{s.value}</div>
//               <div className={`text-xs ${s.percentClass}`}>{s.percent}</div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
//         <h1 className=" text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-purple-500">Employee</h1>
//         <Space wrap>
//           <Input.Search placeholder="Search name" allowClear onSearch={(val) => setSearchText(val)} style={{ width: 200 }} />
//           <Popover
//             content={
//               <FiltersPopover
//                 onApply={(filters) => setFilterParams(filters)}
//                 companies={companies}
//                 divisions={divisions}
//                 branches={branches}
//                 departments={departments}
//                 designations={designations}
//               />
//             }
//             trigger="click"
//             placement="bottomLeft"
//           >
//             <Button icon={<FilterOutlined />}>Filters</Button>
//           </Popover>
//           <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
//             Add Employee
//           </Button>
//           {showCustomButton && (
//             <Dropdown
//               menu={{
//                 items: allColumns.map((col) => ({
//                   key: col.key,
//                   label: (
//                     <Space>
//                       <Switch
//                         checked={visibleColumns.includes(col.key)}
//                         onChange={(chk) =>
//                           setVisibleColumns((vs) => (chk ? [...vs, col.key] : vs.filter((k) => k !== col.key)))
//                         }
//                       />
//                       {col.title}
//                     </Space>
//                   ),
//                 })),
//               }}
//             >
//               <Button icon={<SettingOutlined />} />
//             </Dropdown>
//           )}
//           <Button
//             icon={viewMode === "table" ? <AppstoreOutlined /> : <TableOutlined />}
//             onClick={() => setViewMode((m) => (m === "table" ? "card" : "table"))}
//           />
//         </Space>
//       </div>

//       {/* Table */}
//       {viewMode === "table" && (
//         <div className="overflow-x-auto">
//           <Table
//             columns={columns}
//             dataSource={employees}
//             size="small"
//             loading={loading}
//             pagination={pagination}
//             rowKey="key"
//             scroll={{ x: "max-content" }}
//             bordered
//           />
//         </div>
//       )}

//       {/* Add Modal */}
//       <Modal
//         title="Add Employee"
//         open={addModalVisible}
//         onCancel={() => setAddModalVisible(false)}
//         footer={null}
//         width={800}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           className="space-y-4"
//           onFinish={(values) => {
//             const newEmployee = {
//               ...values,
//               key: employees.length + 1,
//               status: values.status || "active",
//               profileImage,
//             };
//             setEmployees((prev) => [...prev, newEmployee]); // ✅ Adds employee to table
//             message.success("Employee added successfully!");
//             form.resetFields();
//             setProfileImage(null);
//             setAddModalVisible(false);
//           }}
//         >
// <Form.Item label="Profile Picture">
//   <div className="flex items-center gap-4">
//     <div
//       className="relative rounded-full flex items-center justify-center overflow-hidden bg-gray-100"
//       style={{ width: 64, height: 64 }}
//     >
//       {profileImage ? (
//         <img
//           src={profileImage}
//           alt="profile"
//           className="w-full h-full object-cover"
//         />
//       ) : (
//         <UserOutlined style={{ fontSize: 28, color: "#bfbfbf" }} />
//       )}

//       {/* Edit & Remove Icons */}
//       {profileImage && (
//         <div className="absolute inset-0 flex items-center justify-center gap-3 bg-white bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
//           <Upload
//             beforeUpload={(file) => {
//               setProfileImage(URL.createObjectURL(file));
//               return false;
//             }}
//             showUploadList={false}
//           >
//             <EditOutlined
//               style={{
//                 fontSize: 18,
//                 color: "gray",
//                 cursor: "pointer",
//               }}
//               title="Edit Profile"
//             />
//           </Upload>

//           <DeleteOutlined
//             style={{
//               fontSize: 18,
//               color: "gray",
//               cursor: "pointer",
//             }}
//             title="Remove Profile"
//             onClick={() => setProfileImage(null)}
//           />
//         </div>
//       )}
//     </div>

//     {/* Upload Icon (when no image) */}
//     {!profileImage && (
//       <Upload
//         beforeUpload={(file) => {
//           setProfileImage(URL.createObjectURL(file));
//           return false;
//         }}
//         showUploadList={false}
//       >
//         <UploadOutlined
//           style={{
//             fontSize: 22,
//             color: "#1890ff",
//             cursor: "pointer",
//           }}
//           title="Upload Profile"
//         />
//       </Upload>
//     )}
//   </div>
// </Form.Item>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Form.Item name="employeeCode" label="Employee Code" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>
//             <Form.Item name="attendanceId" label="Attendance ID" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>
//             <Form.Item name="firstName" label=" Name" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>
//             <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>
//             <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
//               <DatePicker style={{ width: "100%" }} />
//             </Form.Item>
//             <Form.Item name="reportingManager" label="Reporting Manager" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>
//             <Form.Item name="employeeType" label="Employee Type" rules={[{ required: true }]}>
//               <Select placeholder="Select Type">
//                 <Option value="permanent">Permanent</Option>
//                 <Option value="contract">Contract</Option>
//                 <Option value="intern">Intern</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item name="status" label="Status" rules={[{ required: true }]}>
//               <Select placeholder="Select Status">
//                 <Option value="active">Active</Option>
//                 <Option value="inactive">Inactive</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item name="shiftType" label="Shift Type" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>
//           </div>

//           <Form.Item className="text-right">
//             <Button type="primary" htmlType="submit" loading={loading}>
//               Save
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Employee;
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Popover,
  Dropdown,
  Menu,
  Tag,
  message,
  Select,
  Modal,
  Space,
  Switch,
  Card,
  Form,
  DatePicker,
  Upload,
  Avatar,
} from "antd";
import {
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  TableOutlined,
  AppstoreOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const FiltersPopover = ({
  onApply,
  companies = [],
  divisions = [],
  branches = [],
  departments = [],
  designations = [],
}) => {
  const [filters, setFilters] = useState({});
  const fields = [
    {
      key: "divisionId",
      label: "Division",
      options: divisions.map((d) => ({ label: d.name, value: d.id })),
    },
    {
      key: "branchId",
      label: "Branch",
      options: branches.map((b) => ({ label: b.name, value: b.id })),
    },
    {
      key: "departmentId",
      label: "Department",
      options: departments.map((d) => ({ label: d.name, value: d.id })),
    },
    {
      key: "designationId",
      label: "Designation",
      options: designations.map((d) => ({ label: d.name, value: d.id })),
    },
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];
  const onChange = (field, value) => setFilters((f) => ({ ...f, [field]: value }));

  return (
    <div style={{ padding: 10, width: 240 }}>
      {fields.map(({ key, label, options }) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <Popover
            content={
              <>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
                <Select
                  allowClear
                  placeholder={`Select ${label}`}
                  style={{ width: 200 }}
                  value={filters[key]}
                  onChange={(val) => onChange(key, val)}
                >
                  {options.map((o) => (
                    <Option key={o.value} value={o.value}>
                      {o.label}
                    </Option>
                  ))}
                </Select>
              </>
            }
            trigger="hover"
            placement="right"
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: filters[key] ? 600 : 400,
                color: filters[key] ? "#1890ff" : undefined,
              }}
            >
              {label}
              {filters[key] && <span style={{ marginLeft: 4 }}>(1)</span>}
            </div>
          </Popover>
        </div>
      ))}
      <Space style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
        <Button
          danger
          size="small"
          onClick={() => {
            setFilters({});
            onApply({});
          }}
          disabled={!Object.values(filters).some((v) => v != null)}
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => onApply(filters)}
          disabled={!Object.values(filters).some((v) => v != null)}
        >
          Apply
        </Button>
      </Space>
    </div>
  );
};

const Employee = () => {
  const navigate = useNavigate();
  const primaryColor = "#10b981";
  const showCustomButton = true;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [filterParams, setFilterParams] = useState({});
  const [visibleColumns, setVisibleColumns] = useState([
    "employeeId",
    "attendanceId",
    "firstName",
    "lastName",
    "dateOfJoining",
    "reportingManager",
    "employeeType",
    "status",
    "shiftType",
    "actions",
  ]);
  const [viewMode, setViewMode] = useState("table");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPagination({ current: 1, pageSize: 10, total: 1 });
      setLoading(false);
    }, 500);
  }, []);

  // 🔹 Compute stats dynamically from employees list
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const inactiveEmployees = employees.filter((e) => e.status === "inactive").length;
  const newJoiners = employees.filter((e) => {
    if (!e.dateOfJoining) return false;
    const joiningDate = moment(e.dateOfJoining);
    return moment().diff(joiningDate, "days") <= 30;
  }).length;

  const dynamicStats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      color: "bg-black",
      percent: `${totalEmployees > 0 ? "100%" : "0%"}`,
      percentClass: "text-purple-500",
    },
    {
      title: "Active",
      value: activeEmployees,
      color: "bg-green-500",
      percent: `${totalEmployees
          ? ((activeEmployees / totalEmployees) * 100).toFixed(0) + "%"
          : "0%"
        }`,
      percentClass: "text-green-500",
    },
    {
      title: "Inactive",
      value: inactiveEmployees,
      color: "bg-red-500",
      percent: `${totalEmployees
          ? ((inactiveEmployees / totalEmployees) * 100).toFixed(0) + "%"
          : "0%"
        }`,
      percentClass: "text-gray-500",
    },
    {
      title: "New Joiners",
      value: newJoiners,
      color: "bg-blue-500",
      percent: `${totalEmployees
          ? ((newJoiners / totalEmployees) * 100).toFixed(0) + "%"
          : "0%"
        }`,
      percentClass: "text-blue-500",
    },
  ];

  // 👇 Employee Table Columns
  const allColumns = [
    {
      title: "S.No",
      key: "serial",
      render: (_, __, i) =>
        (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profile",
      render: (_, record) => (
        <Avatar
          src={record.profileImage}
          icon={!record.profileImage && <UserOutlined />}
          style={{
            backgroundColor: "#EDE9FE",
            color: primaryColor,
            cursor: "pointer",
          }}
          size={40}
        />
      ),
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (id, record) => (
        <span
          style={{
            color: "#10b981",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() =>
            navigate(`/hrms/pages/employee/${record.key}`, {
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
      key: "firstName",
      render: (_, record) => `${record.firstName || ""} ${record.lastName || ""}`,
    },
    { title: "Reporting Manager", dataIndex: "reportingManager", key: "reportingManager" },
    { title: "Employee Type", dataIndex: "employeeType", key: "employeeType" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "active" ? "green" : "red"}>
          {s?.[0].toUpperCase() + s.slice(1)}
        </Tag>
      ),
    },
    { title: "Shift Type", dataIndex: "shiftType", key: "shiftType" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12 }}>
          <EditOutlined
            style={{ fontSize: 18, color: primaryColor, cursor: "pointer" }}
            onClick={() =>
              navigate(`/hrms/pages/employee/${record.key}`, {
                state: { employee: record },
              })
            }
            title="Edit"
          />
          <DeleteOutlined
            style={{ fontSize: 18, color: "red", cursor: "pointer" }}
            onClick={() => {
              // Delete logic
              setEmployees((prev) => prev.filter((e) => e.key !== record.key));
              message.success("Employee deleted successfully!");
            }}
            title="Delete"
          />
        </div>
      ),
    }

  ];

  const columns = allColumns.filter((c) => visibleColumns.includes(c.key));

  return (
    <div className="bg-white p-4">
      {/* Stats */}
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
              <div className={`text-xs ${s.percentClass}`}>{s.percent}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
        <h2 className="font-semibold text-xl">
          Employee
        </h2>

        <Space wrap>
          <Input.Search
            placeholder="Search name"
            allowClear
            onSearch={(val) => setSearchText(val)}
            style={{ width: 200 }}
          />
          <Popover
            content={
              <FiltersPopover
                onApply={(filters) => setFilterParams(filters)}
                companies={companies}
                divisions={divisions}
                branches={branches}
                departments={departments}
                designations={designations}
              />
            }
            trigger="click"
            placement="bottomLeft"
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Popover>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
          >
            Add Employee
          </Button>
          {showCustomButton && (
            <Dropdown
              menu={{
                items: allColumns.map((col) => ({
                  key: col.key,
                  label: (
                    <Space>
                      <Switch
                        checked={visibleColumns.includes(col.key)}
                        onChange={(chk) =>
                          setVisibleColumns((vs) =>
                            chk
                              ? [...vs, col.key]
                              : vs.filter((k) => k !== col.key)
                          )
                        }
                      />
                      {col.title}
                    </Space>
                  ),
                })),
              }}
            >
              <Button icon={<SettingOutlined />} />
            </Dropdown>
          )}
          <Button
            icon={
              viewMode === "table" ? <AppstoreOutlined /> : <TableOutlined />
            }
            onClick={() =>
              setViewMode((m) => (m === "table" ? "card" : "table"))
            }
          />
        </Space>
      </div>

      {/* Table */}
      {viewMode === "table" && (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={employees}
            size="small"
            loading={loading}
            pagination={pagination}
            rowKey="key"
            scroll={{ x: "max-content" }}
            bordered
          />
        </div>
      )}

      {/* Add Modal */}
      <Modal
        title={<span className="text-xl  text-center font-semibold block w-full">Add Employee</span>}
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          className="space-y-4"
          onFinish={(values) => {
            const newEmployee = {
              ...values,
              key: employees.length + 1,
              status: values.status || "active",
              profileImage,
            };
            setEmployees((prev) => [...prev, newEmployee]);
            message.success("Employee added successfully!");
            form.resetFields();
            setProfileImage(null);
            setAddModalVisible(false);
          }}
        >
          <Form.Item label={<span className="text-gray-600">Profile Picture</span>}>
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
                        style={{
                          fontSize: 18,
                          color: "gray",
                          cursor: "pointer",
                        }}
                        title="Edit Profile"
                      />
                    </Upload>

                    <DeleteOutlined
                      style={{
                        fontSize: 18,
                        color: "gray",
                        cursor: "pointer",
                      }}
                      title="Remove Profile"
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
                    style={{
                      fontSize: 22,
                      color: "#1890ff",
                      cursor: "pointer",
                    }}
                    title="Upload Profile"
                  />
                </Upload>
              )}
            </div>
          </Form.Item>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="employeeId"
              label={<span className="text-gray-600">Employee ID</span>}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="attendanceId"
              label={<span className="text-gray-600">Attendance ID</span>}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="firstName"
              label={<span className="text-gray-600">First Name</span>}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={<span className="text-gray-600">Last Name</span>}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="dateOfJoining"
              label={<span className="text-gray-600">Date of Joining</span>}
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="reportingManager"
              label={<span className="text-gray-600">Reporting Manager</span>}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="employeeType"
              label={<span className="text-gray-600">Employee Type</span>}
              rules={[{ required: true }]}
            >
              <Select placeholder="Select Type">
                <Option value="permanent">Permanent</Option>
                <Option value="contract">Contract</Option>
                <Option value="intern">Intern</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label={<span className="text-gray-600">Status</span>}
              rules={[{ required: true }]}
            >
              <Select placeholder="Select Status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="shiftType"
              label={<span className="text-gray-600">Shift Type</span>}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item className="flex justify-end gap-2">
            <Button
              type="default"
              onClick={() => setAddModalVisible(false)} // or your cancel logic
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Employee;
