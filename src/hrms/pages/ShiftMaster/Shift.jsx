import React, { useState, useEffect } from "react";
import {
  Table,
  Dropdown,
  Menu,
  Input,
  Popover,
  Button,
  Select,
  message,
  Tag,
  Space,
  Switch,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SettingOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { shiftService } from "../../services/shift";

const { Option } = Select;

const getUniqueValues = (data, key) => {
  if (key === "status") {
    return [...new Set(data.map((item) => item[key]))].filter(Boolean);
  }
  return [
    ...new Map(
      data
        .map((item) => item[key])
        .filter(Boolean)
        .map((item) => [item.id, { id: item.id, name: item.name }])
    ).values(),
  ];
};

const FiltersPopover = ({ onApply, dataSource, currentFilters }) => {
  const [filters, setFilters] = useState({
    department: currentFilters.department,
    division: currentFilters.division,
    // company: currentFilters.company,
    branch: currentFilters.branch,
    status: currentFilters.status,
  });

  const departments = getUniqueValues(dataSource, "department");
  const divisions = getUniqueValues(dataSource, "division");
  // const companies = getUniqueValues(dataSource, 'company');
  const branch = getUniqueValues(dataSource, "branch");
  const statuses = getUniqueValues(dataSource, "status");

  const onChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "department" ? { division: undefined } : {}),
    }));
  };

  const renderPopoverContent = (field) => {
    let options = [];

    switch (field) {
      case "department":
        options = departments;
        break;
      case "division":
        if (filters.department) {
          options = [
            ...new Map(
              dataSource
                .filter((d) => d.department?.id === filters.department)
                .map((d) => d.division)
                .filter(Boolean)
                .map((d) => [d.id, { id: d.id, name: d.name }])
            ).values(),
          ];
        } else {
          options = divisions;
        }
        break;
      // case 'company':
      //     options = companies;
      //     break;
      case "branch":
        options = branch;
        break;
      case "status":
        options = statuses;
        break;
      default:
        break;
    }

    return (
      <div>
        <div style={{ marginBottom: 3, fontWeight: "bold", color: "#555" }}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </div>
        <Select
          value={filters[field]}
          onChange={(val) => onChange(field, val)}
          placeholder={`Select ${
            field.charAt(0).toUpperCase() + field.slice(1)
          }`}
          style={{ width: 180 }}
          allowClear
        >
          {options.map((opt) =>
            field === "status" ? (
              <Option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase()}
              </Option>
            ) : (
              <Option key={opt.id} value={opt.id}>
                {opt.name.charAt(0).toUpperCase() + opt.name.slice(1)}
              </Option>
            )
          )}
        </Select>
      </div>
    );
  };

  return (
    <div style={{ padding: 10, width: 200, height: "auto" }}>
      {["branch", "department", "division", "status"].map((field) => (
        <div key={field} style={{ marginBottom: 15 }}>
          <Popover
            content={renderPopoverContent(field)}
            trigger="hover"
            placement="right"
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                width: 100,
                color: filters[field] ? "#1890ff" : "inherit",
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {filters[field] && (
                <span className="ml-2 text-xs text-gray-500">(1)</span>
              )}
            </div>
          </Popover>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 20 }} className="space-x-2">
        <Button
          danger
          size="small"
          onClick={() => {
            setFilters({});
            onApply({});
          }}
          disabled={Object.values(filters).every((val) => !val)}
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => onApply(filters)}
          disabled={Object.values(filters).every((val) => !val)}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

const Shift = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    company: undefined,
    department: undefined,
    branch: undefined,
    division: undefined,
    status: undefined,
  });
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { primaryColor, contentBgColor, showCustomButton } = useTheme();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const localStorageKey = "shiftVisibleColumns";

  const [viewMode, setViewMode] = useState(
    localStorage.getItem("shiftViewMode") || "table"
  );
  useEffect(() => {
    localStorage.setItem("shiftViewMode", viewMode);
  }, [viewMode]);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const stored = localStorage.getItem(localStorageKey);
    return stored
      ? JSON.parse(stored)
      : [
          "companyname",
          "divisionname",
          "branchname",
          "shift_name",
          "shift_type",
          "total_hours",
          "status",
          "actions",
        ];
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    localStorage.setItem("shiftvisiblecolumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const fetchShift = async (
    paginationParams = pagination,
    search = searchText,
    appliedFilters = filters
  ) => {
    setLoading(true);
    try {
      const params = {
        page: paginationParams.current,
        pageSize: paginationParams.pageSize,
        search: search || undefined,
        department_id: appliedFilters.department,
        division_id: appliedFilters.division,
        company_id: appliedFilters.company,
        branch_id: appliedFilters.branch,
        status: appliedFilters.status,
      };
      console.log("Fetching with params:", params);
      const response = await shiftService.getshiftAll(params);
      console.log("API response:", response);
      const shiftArray = response.data.data.map((item) => ({
        ...item,
        company: item.company || { id: null, name: "N/A" },
        department: item.department || { id: null, name: "N/A" },
        branch: item.branch || { id: null, name: "N/A" },
        division: item.division || { id: null, name: "N/A" },
        status: item.status || "",
      }));
      setShiftData(shiftArray);
      setPagination({
        current: paginationParams.current,
        pageSize: paginationParams.pageSize,
        total:
          response.data.meta?.total || response.data.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching shift data:", error);
      messageApi.error("Failed to fetch shifts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShift();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      messageApi.success(location.state.message);
      const { message, ...rest } = location.state;
      window.history.replaceState({ ...rest }, document.title);
    }
  }, [location.state, messageApi]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchShift({ ...pagination, current: 1 }, value, filters);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchShift({ ...pagination, current: 1 }, searchText, newFilters);
  };

  const handleTableChange = (newPagination) => {
    console.log("Table pagination change:", newPagination);
    setPagination(newPagination);
    fetchShift(newPagination, searchText, filters);
  };

  const handleEdit = (record) => {
    navigate("/hrms/pages/shiftcreate", {
      state: { isEdit: true, initialValues: record },
    });
  };

  const handleDelete = async (record) => {
    try {
      await shiftService.deleteShift(record.id);
      messageApi.success("Shift deleted successfully");
      fetchShift();
    } catch (error) {
      messageApi.error("Failed to delete shift");
      console.error("Delete error:", error);
    }
  };

  const handleMenuClick = (record, e) => {
    if (e.key === "edit") return handleEdit(record);
    if (e.key === "delete") return handleDelete(record);
    if (e.key === "view") {
      console.log("View:", record);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) =>
          setSelectedRowKeys(changableRowKeys.filter((_, i) => i % 2 === 0)),
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) =>
          setSelectedRowKeys(changableRowKeys.filter((_, i) => i % 2 !== 0)),
      },
    ],
  };

  const allColumns = [
    {
      title: "S.No",
      key: "serialNumber",
      width: 70,
      render: (_, _record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Company Name",
      key: "companyname",
      render: (_, record) => {
        const name = record.company?.name || "N/A";
        return name.charAt(0).toUpperCase() + name.slice(1);
      },
    },
    {
      title: "Division Name",
      key: "divisionname",
      render: (_, record) => {
        const name = record.division?.name || "N/A";
        return name.charAt(0).toUpperCase() + name.slice(1);
      },
    },
    {
      title: "Branch Name",
      key: "branchname",
      render: (_, record) => {
        const name = record.branch?.name || "N/A";
        return name.charAt(0).toUpperCase() + name.slice(1);
      },
    },
    {
      title: "Department Name",
      key: "departmentname",
      render: (_, record) => {
        const name = record.department?.name || "N/A";
        return name.charAt(0).toUpperCase() + name.slice(1);
      },
    },
    {
      title: "Shift Name",
      key: "shift_name",
      render: (_, record) => {
        const name = record.shift_name || "";
        return name.charAt(0).toUpperCase() + name.slice(1);
      },
    },
    {
      title: "Shift Type",
      key: "shift_type",
      render: (_, record) => {
        const type = record.shift_type || "";
        return type.charAt(0).toUpperCase() + type.slice(1);
      },
    },
    {
      title: "Total Hours",
      dataIndex: "total_hours",
      key: "total_hours",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const status = record.status || "";
        const label = status.charAt(0).toUpperCase() + status.slice(1);
        if (!status) return label;
        return <Tag color={status === "active" ? "green" : "red"}>{label}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, rec) => (
        <Dropdown
          overlay={
            <Menu onClick={(e) => handleMenuClick(rec, e)}>
              <Menu.Item icon={<EyeOutlined />} key="view">
                View
              </Menu.Item>
              <Menu.Item icon={<EditOutlined />} key="edit">
                Edit
              </Menu.Item>
              <Menu.Item icon={<DeleteOutlined />} key="delete">
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <EllipsisOutlined className="cursor-pointer text-lg rotate-90" />
        </Dropdown>
      ),
    },
  ];
  const columns = allColumns.filter((col) =>
    visibleColumns.includes(col.dataIndex || col.key)
  );
  return (
    <>
      {contextHolder}
      <div className="max-w-full overflow-hidden">
        <div className="bg-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h2 className="font-semibold text-xl">Shift</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-[250px] min-w-[200px]">
                <Input.Search
                  placeholder="Search by name"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full"
                  allowClear
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
                <Popover
                  content={
                    <FiltersPopover
                      dataSource={shiftData}
                      currentFilters={filters}
                      onApply={handleFilterApply}
                    />
                  }
                  trigger="click"
                  placement="bottomLeft"
                >
                  <Button
                    type=""
                    icon={<FilterOutlined />}
                    className="w-full sm:w-auto"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    Filters
                  </Button>
                </Popover>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/hrms/pages/createshift")}
                >
                  Add Shift
                </Button>
                {showCustomButton && (
                  <Dropdown
                    menu={{
                      items: allColumns.map((col) => ({
                        key: col.dataIndex || col.key,
                        label: (
                          <Space>
                            <Switch
                              checked={visibleColumns.includes(
                                col.dataIndex || col.key
                              )}
                              onChange={(checked) => {
                                if (checked) {
                                  setVisibleColumns([
                                    ...visibleColumns,
                                    col.dataIndex || col.key,
                                  ]);
                                } else {
                                  setVisibleColumns(
                                    visibleColumns.filter(
                                      (k) => k !== (col.dataIndex || col.key)
                                    )
                                  );
                                }
                              }}
                            />
                            {col.title}
                          </Space>
                        ),
                      })),
                    }}
                  >
                    <Button icon={<SettingOutlined />}></Button>
                  </Dropdown>
                )}
                <Button
                  icon={
                    viewMode === "table" ? (
                      <AppstoreOutlined />
                    ) : (
                      <TableOutlined />
                    )
                  }
                  onClick={() =>
                    setViewMode((m) => (m === "table" ? "card" : "table"))
                  }
                >
                  {/* {viewMode === "table" ? "Card View" : "Table View"} */}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={shiftData}
              size="small" // 👈 Added this line
              pagination={{
                ...pagination,
                responsive: true,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={handleTableChange}
              rowKey="id"
              scroll={{ x: "max-content" }}
              className="w-full"
              loading={loading}
              components={{
                header: {
                  cell: (props) => (
                    <th
                      {...props}
                      style={{
                        // backgroundColor: primaryColor,
                        // color: contentBgColor,
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        padding: "8px 8px",
                        whiteSpace: "nowrap",
                      }}
                    />
                  ),
                },
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {shiftData.length ? (
              shiftData.map((rec, idx) => (
                <Card
                  key={rec.id}
                  title={`${
                    (pagination.current - 1) * pagination.pageSize + idx + 1
                  }. ${rec.shift_name}`}
                >
                  <p>
                    <strong>Company:</strong> {rec.company.name}
                  </p>
                  <p>
                    <strong>Division:</strong> {rec.division.name}
                  </p>
                  <p>
                    <strong>Branch:</strong> {rec.branch.name}
                  </p>
                  <p>
                    <strong>Department:</strong> {rec.department.name}
                  </p>
                  <p>
                    <strong>Total Hours:</strong> {rec.total_hours}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Tag color={rec.status === "active" ? "green" : "red"}>
                      {rec.status}
                    </Tag>
                  </p>
                  <Dropdown
                    overlay={
                      <Menu onClick={(e) => handleMenuClick(rec, e)}>
                        <Menu.Item key="view" icon={<EyeOutlined />}>
                          View
                        </Menu.Item>
                        <Menu.Item key="edit" icon={<EditOutlined />}>
                          Edit
                        </Menu.Item>
                        <Menu.Item key="delete" icon={<DeleteOutlined />}>
                          Delete
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                  >
                    <EllipsisOutlined className="cursor-pointer text-lg rotate-90" />
                  </Dropdown>
                </Card>
              ))
            ) : (
              <div className="py-10 text-center col-span-full">
                No shifts found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Shift;
