// src/company/pages/Branch.jsx  (adjust filename/path in your project)
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Dropdown,
  Form,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Popover,
  Menu,
  Tag,
  message,
  Space,
  Card,
  Checkbox,
} from "antd";
import {
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  AppstoreOutlined,
  TableOutlined,
} from "@ant-design/icons";

// Import your API module (update path if needed)
import BranchApi from "../pages/Branch";
// Import address services (update path if needed)

const { Option } = Select;

/* ---------- Helpers / Small components ---------- */

const getUniqueValues = (data = [], key) =>
  [...new Set((data || []).map((item) => item[key]))].filter(Boolean);

const FiltersPopover = ({ onApply, dataSource = [], currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    name: currentFilters.name || undefined,
    status: currentFilters.status || undefined,
  });

  useEffect(() => {
    setFilters({
      name: currentFilters.name || undefined,
      status: currentFilters.status || undefined,
    });
  }, [currentFilters]);

  const branches = getUniqueValues(dataSource, "name");
  const statuses = getUniqueValues(dataSource, "status");

  const onChange = (field, value) => setFilters((p) => ({ ...p, [field]: value }));

  const renderPopoverContent = (field, options) => (
    <div>
      <div style={{ marginBottom: 6, fontWeight: "bold", color: "#555" }}>
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </div>
      <Select
        value={filters[field]}
        onChange={(val) => onChange(field, val)}
        placeholder={`Select ${field}`}
        style={{ width: 220 }}
        allowClear
      >
        {options.map((opt) => (
          <Option key={String(opt)} value={opt}>
            {String(opt)
              .toLowerCase()
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </Option>
        ))}
      </Select>
    </div>
  );

  return (
    <div style={{ padding: 10, width: 240 }}>
      {["name", "status"].map((field) => (
        <div key={field} style={{ marginBottom: 12 }}>
          <Popover
            content={renderPopoverContent(field, field === "name" ? branches : statuses)}
            trigger="hover"
            placement="right"
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: 600,
                color: filters[field] ? "#1890ff" : "inherit",
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {filters[field] && <span style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>(1)</span>}
            </div>
          </Popover>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: 14 }}>
        <Button
          danger
          size="small"
          onClick={() => {
            setFilters({});
            onApply({});
          }}
          disabled={Object.values(filters).every((v) => !v)}
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => onApply(filters)}
          disabled={Object.values(filters).every((v) => !v)}
          style={{ marginLeft: 8 }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

const ColumnVisibilityDropdown = ({ allColumns = [], visibleColumns = [], setVisibleColumns }) => {
  const onChange = (checked) => setVisibleColumns(checked || []);

  const menu = (
    <div style={{ padding: 12, minWidth: 220 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Columns</div>
      <Checkbox.Group style={{ display: "block" }} value={visibleColumns} onChange={onChange}>
        {allColumns.map((col) => (
          <div key={col.key} style={{ padding: "6px 0" }}>
            <Checkbox value={col.key}>{col.title}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button>Columns</Button>
    </Dropdown>
  );
};

/* ---------- Branch component (API integrated) ---------- */

const Branch = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);

  // address dropdown state
  const [country, setCountry] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [viewMode, setViewMode] = useState(localStorage.getItem("branchViewMode") || "table");
  useEffect(() => localStorage.setItem("branchViewMode", viewMode), [viewMode]);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("branchVisibleColumns");
      return saved ? JSON.parse(saved) : ["name", "phone", "description", "address", "status", "action"];
    } catch {
      return ["name", "phone", "description", "address", "status", "action"];
    }
  });
  useEffect(() => localStorage.setItem("branchVisibleColumns", JSON.stringify(visibleColumns)), [visibleColumns]);

  /* ---------- API helpers ---------- */

  const parseBranchesFromResponse = (res) => {
    // Accept many shapes: axios-res.data.data.branches, axios-res.data.branches, array
    const d = res?.data ?? res;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data?.branches)) return d.data.branches;
    if (Array.isArray(d?.branches)) return d.branches;
    if (Array.isArray(d?.data)) return d.data;
    return [];
  };

  const isSuccessResponse = (res) => {
    // many APIs use { success: true } inside data; fallback to HTTP status
    return Boolean(res?.data?.success ?? res?.success ?? (res?.status >= 200 && res?.status < 300));
  };

  /* ---------- Fetchers ---------- */

  const fetchCountry = async () => {
    try {
      const res = await (addressServices?.getCountry?.() ?? addressServices.getCountries?.());
      // support different shapes
      const list = res?.data ?? res;
      setCountry(Array.isArray(list) ? list : list?.data ?? []);
    } catch (err) {
      console.error("fetchCountry error:", err);
      messageApi.error("Failed to fetch countries");
    }
  };

  const fetchState = async (countryId) => {
    try {
      const res = await (addressServices?.getState?.(countryId) ?? addressServices.getStates?.(countryId));
      const list = res?.data ?? res;
      setStateList(Array.isArray(list) ? list : list?.data ?? []);
    } catch (err) {
      console.error("fetchState error:", err);
      messageApi.error("Failed to fetch states");
      setStateList([]);
    }
  };

  const fetchCity = async (stateId) => {
    try {
      const res = await (addressServices?.getCity?.(stateId) ?? addressServices.getCities?.(stateId));
      const list = res?.data ?? res;
      setCityList(Array.isArray(list) ? list : list?.data ?? []);
    } catch (err) {
      console.error("fetchCity error:", err);
      messageApi.error("Failed to fetch cities");
      setCityList([]);
    }
  };

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await BranchApi.getAll();
      if (!isSuccessResponse(res) && !res?.data) {
        // if API uses non-success flag, we still try to parse branches if present
        messageApi.error("Failed to fetch branches");
        setBranchData([]);
        setFilteredData([]);
        return;
      }
      const branches = parseBranchesFromResponse(res);
      const data = branches.map((b) => ({ ...b, key: b.id ?? b._id }));
      setBranchData(data);
      setFilteredData(data);
    } catch (err) {
      console.error("fetchBranches error:", err);
      messageApi.error("Failed to fetch branches");
      setBranchData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initialize countries and branches
    const init = async () => {
      setLoading(true);
      try {
        await fetchCountry();
        await fetchBranches();
      } catch (err) {
        console.error("init error:", err);
        messageApi.error("Initialization failed");
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Handlers: create / update / delete ---------- */

  const handleFormSubmit = async (values) => {
    // validate required address fields
    if (!values.country || !values.state || !values.city || !values.country_code) {
      messageApi.error("Please select country, state, city, and country code");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: values.branch,
        description: values.description || "",
        phone: values.phone,
        country_code: values.country_code,
        email: values.email,
        address_line1: values.address_line1,
        address_line2: values.address_line2 || "",
        city: Number(values.city),
        state: Number(values.state),
        country: Number(values.country),
        pincode: values.pincode ? Number(values.pincode) : undefined,
        created_by: 1,
      };

      const res = await BranchApi.create(payload);
      if (!isSuccessResponse(res)) {
        const errMsg = res?.data?.error?.message ?? res?.data?.message ?? "Failed to create branch";
        messageApi.error(errMsg);
        console.error("create branch failed", res);
        return;
      }
      messageApi.success(res?.data?.message ?? "Branch created");
      setIsModalOpen(false);
      form.resetFields();
      await fetchBranches();
    } catch (err) {
      console.error("handleFormSubmit error:", err);
      const errMsg = err?.response?.data?.message ?? err?.message ?? "Failed to create branch";
      messageApi.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (values) => {
    if (!currentBranch) return;
    if (!values.country || !values.state || !values.city || !values.country_code) {
      messageApi.error("Please select country, state, city, and country code");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: values.branch,
        description: values.description || "",
        phone: values.phone,
        country_code: values.country_code,
        email: values.email,
        status: values.status,
        address_line1: values.address_line1,
        address_line2: values.address_line2 || "",
        city: Number(values.city),
        state: Number(values.state),
        country: Number(values.country),
        pincode: values.pincode ? Number(values.pincode) : undefined,
        updated_by: 1,
      };

      const res = await BranchApi.update(currentBranch.id ?? currentBranch.key, payload);
      if (!isSuccessResponse(res)) {
        const errMsg = res?.data?.error?.message ?? res?.data?.message ?? "Failed to update branch";
        messageApi.error(errMsg);
        console.error("update branch failed", res);
        return;
      }
      messageApi.success(res?.data?.message ?? "Branch updated");
      setIsEditModalOpen(false);
      editForm.resetFields();
      await fetchBranches();
    } catch (err) {
      console.error("handleEditSubmit error:", err);
      const errMsg = err?.response?.data?.message ?? err?.message ?? "Failed to update branch";
      messageApi.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Confirm delete",
      content: "Are you sure you want to delete this branch?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        setLoading(true);
        try {
          const res = await BranchApi.delete(id);
          if (!isSuccessResponse(res)) {
            messageApi.error(res?.data?.message ?? "Failed to delete branch");
            return;
          }
          messageApi.success(res?.data?.message ?? "Branch deleted");
          await fetchBranches();
        } catch (err) {
          console.error("delete error:", err);
          messageApi.error("Failed to delete branch");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  /* ---------- Filters & Search ---------- */

  const applyFilters = (newFilters = filters, newSearch = searchText) => {
    let fd = [...branchData];
    if (newSearch) {
      fd = fd.filter((item) => String(item.name || "").toLowerCase().includes(String(newSearch).toLowerCase()));
    }
    Object.entries(newFilters || {}).forEach(([key, val]) => {
      if (val) fd = fd.filter((item) => String(item[key]) === String(val));
    });
    setFilteredData(fd);
  };

  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearchText(v);
    applyFilters(filters, v);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters, searchText);
  };

  /* ---------- Row actions ---------- */

  const handleViewBranch = (record) => {
    setCurrentBranch(record);
    setIsViewModalOpen(true);
  };

  const handleEditBranch = (record) => {
    setCurrentBranch(record);
    // set form fields from record. Use safe fallback names
    editForm.setFieldsValue({
      branch: record.name,
      description: record.description,
      phone: record.phone,
      country_code: record.country_code,
      email: record.email,
      address_line1: record.address_line1,
      address_line2: record.address_line2,
      city: record.city,
      state: record.state,
      country: record.country,
      pincode: record.pincode,
      status: record.status,
    });

    if (record.country) {
      fetchState(record.country).then(() => {
        if (record.state) fetchCity(record.state);
      });
    }
    setIsEditModalOpen(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  };

  /* ---------- Columns ---------- */

  const allColumns = [
    { title: "S.No", key: "serialNumber", width: 60, align: "center", render: (_, __, idx) => idx + 1 },
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name) => (name ? String(name).replace(/\b\w/g, (l) => l.toUpperCase()) : ""),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 140,
      render: (phone, record) => `${record.country_code || ""} ${phone || ""}`,
    },
    { title: "Email", dataIndex: "email", key: "email", width: 240 },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (desc) => (desc ? String(desc).charAt(0).toUpperCase() + String(desc).slice(1).toLowerCase() : ""),
    },
    {
      title: "Address",
      key: "address",
      width: 300,
      render: (_, record) => {
        const parts = [
          record.address_line1,
          record.address_line2,
          record.cityRelation?.name ?? record.cityName ?? record.city,
          record.stateRelation?.name,
          record.countryRelation?.name,
          record.pincode,
        ].filter(Boolean);
        return parts.join(", ");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => (
        <Tag
          style={{
            color: status === "Active" ? "#52c41a" : "#f5222d",
            backgroundColor: status === "Active" ? "#f6ffed" : "#fff1f0",
            fontWeight: 500,
            border: `1px solid ${status === "Active" ? "#b7eb8f" : "#ffa39e"}`,
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              onClick={({ key }) => {
                if (key === "view") handleViewBranch(record);
                if (key === "edit") handleEditBranch(record);
                if (key === "delete") handleDelete(record.id ?? record.key);
              }}
            >
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

  const columns = allColumns.filter((c) => visibleColumns.includes(c.key));

  /* ---------- Render ---------- */

  return (
    <>
      {contextHolder}
      <div style={{ padding: 12 }}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h1 className="text-xl font-semibold">Branch</h1>
          <div className="flex gap-2 items-center">
            <Input.Search
              placeholder="Search by branch name"
              value={searchText}
              onChange={handleSearchChange}
              allowClear
              style={{ width: 260 }}
            />
            <Popover
              content={<FiltersPopover dataSource={branchData} currentFilters={filters} onApply={handleFilterApply} />}
              trigger="click"
              placement="bottomLeft"
            >
              <Button icon={<FilterOutlined />}>Filters</Button>
            </Popover>

            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Add Branch
            </Button>

            <ColumnVisibilityDropdown allColumns={allColumns} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />

            <Button icon={viewMode === "table" ? <AppstoreOutlined /> : <TableOutlined />} onClick={() => setViewMode((m) => (m === "table" ? "card" : "table"))} />
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              rowKey="id"
              scroll={{ x: "max-content" }}
              size="small"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredData.length ? (
              filteredData.map((rec, i) => (
                <Card key={rec.id} title={`${i + 1}. ${rec.name}`} className="shadow-sm hover:shadow-md">
                  <p>
                    <strong>Phone:</strong> {rec.country_code} {rec.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {rec.email}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <Tag style={{ marginLeft: 8 }} color={rec.status === "Active" ? "green" : "red"}>
                      {rec.status}
                    </Tag>
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {[rec.address_line1, rec.address_line2, rec.cityRelation?.name, rec.stateRelation?.name, rec.countryRelation?.name, rec.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={({ key }) => {
                          if (key === "view") handleViewBranch(rec);
                          if (key === "edit") handleEditBranch(rec);
                          if (key === "delete") handleDelete(rec.id);
                        }}
                      >
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
                    <EllipsisOutlined rotate={90} className="cursor-pointer text-lg" />
                  </Dropdown>
                </Card>
              ))
            ) : (
              <div className="py-10 text-center">No branches found</div>
            )}
          </div>
        )}

        {/* ---------- Add Branch Modal ---------- */}
        <Modal title="Add Branch" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={800}>
          <Form layout="vertical" form={form} onFinish={handleFormSubmit} initialValues={{ status: "Active" }}>
            <Row gutter={[16, 16]}>
              <Col  xs={10} sm={12}>
                <Form.Item name="branch" label="Branch Name" rules={[{ required: true, message: "Please enter branch name" }, { max: 100 }]}>
                  <Input placeholder="Enter Branch Name" allowClear />
                </Form.Item>
              </Col>

              <Col xs={10} sm={12}>
                <Form.Item label="Phone" required style={{ marginBottom: 0 }}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Form.Item name="country_code" rules={[{ required: true, message: "Country code is required" }]} style={{ marginBottom: 0, width: "30%" }}>
                      <Select placeholder="+91" allowClear showSearch optionFilterProp="children">
                        {country.map((c) => (
                          <Option key={c.country_code ?? c.id} value={c.country_code ?? c.id}>
                            {c.country_code ?? c.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item name="phone" rules={[{ required: true, message: "Phone number is required" }, { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number" }]} style={{ marginBottom: 0, width: "70%" }}>
                      <Input placeholder="Enter phone number" maxLength={10} inputMode="numeric" />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>

              <Col  xs={10} sm={12}>
                <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Please enter a valid email" }]}>
                  <Input placeholder="Enter Email" allowClear />
                </Form.Item>
              </Col>

              <Col  xs={10} sm={12}>
                <Form.Item name="description" label="Description" rules={[{ max: 500 }]}>
                  <Input.TextArea placeholder="Enter Description" allowClear rows={2} />
                </Form.Item>
              </Col>

              <Col  xs={10} sm={12}>
                <Form.Item name="address_line1" label="Address Line 1" rules={[{ required: true, message: "Please enter address" }]}>
                  <Input.TextArea rows={2} placeholder="Enter address line 1" />
                </Form.Item>
              </Col>

              <Col  xs={10} sm={12}>
                <Form.Item name="address_line2" label="Address Line 2">
                  <Input.TextArea rows={2} placeholder="Enter address line 2" />
                </Form.Item>
              </Col>

              <Col  xs={10} sm={12}>
                <Form.Item name="country" label="Country" rules={[{ required: true, message: "Please select country" }]}>
                  <Select placeholder="Select country" onChange={(val) => { form.setFieldsValue({ state: undefined, city: undefined }); fetchState(val); }} loading={loading}>
                    {country.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col  xs={10} sm={12}>
                <Form.Item name="state" label="State" rules={[{ required: true, message: "Please select state" }]}>
                  <Select placeholder="Select state" onChange={(val) => { form.setFieldsValue({ city: undefined }); fetchCity(val); }} loading={loading} disabled={!stateList.length}>
                    {stateList.map((s) => (
                      <Option key={s.id} value={s.id}>
                        {s.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col  xs={10} sm={12}>
                <Form.Item name="city" label="City" rules={[{ required: true, message: "Please select city" }]}>
                  <Select placeholder="Select city" loading={loading} disabled={!cityList.length}>
                    {cityList.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={10} sm={12}>
                <Form.Item name="pincode" label="Pincode" rules={[{ required: true, message: "Please enter pincode" }, { pattern: /^\d{6}$/, message: "Please enter a valid 6-digit pincode" }]}>
                  <Input placeholder="Enter pincode" maxLength={6} inputMode="numeric" />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end" gutter={8}>
              <Col><Button danger onClick={() => setIsModalOpen(false)}>Cancel</Button></Col>
              <Col><Button type="primary" htmlType="submit" loading={loading}>Submit</Button></Col>
            </Row>
          </Form>
        </Modal>

        {/* ---------- View Branch ---------- */}
        <Modal title="View Branch" open={isViewModalOpen} onCancel={() => setIsViewModalOpen(false)} footer={[<Button key="close" onClick={() => setIsViewModalOpen(false)}>Close</Button>]} width={600}>
          {currentBranch ? (
            <div>
              <p><strong>Branch Name:</strong> {currentBranch.name}</p>
              <p><strong>Phone:</strong> {currentBranch.country_code || ""} {currentBranch.phone}</p>
              <p><strong>Email:</strong> {currentBranch.email}</p>
              <p><strong>Status:</strong> {currentBranch.status}</p>
              <p><strong>Description:</strong> {currentBranch.description || "N/A"}</p>
              <p><strong>Address:</strong> {[currentBranch.address_line1, currentBranch.address_line2, currentBranch.cityRelation?.name, currentBranch.stateRelation?.name, currentBranch.countryRelation?.name, currentBranch.pincode].filter(Boolean).join(", ")}</p>
            </div>
          ) : <div>No data</div>}
        </Modal>

        {/* ---------- Edit Branch ---------- */}
        <Modal title="Edit Branch" open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} footer={null} width={800}>
          <Form layout="vertical" form={editForm} onFinish={handleEditSubmit}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name="branch" label="Branch Name" rules={[{ required: true }, { max: 100 }]}>
                  <Input placeholder="Enter Branch Name" allowClear />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label="Phone" required style={{ marginBottom: 0 }}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Form.Item name="country_code" rules={[{ required: true }]} style={{ marginBottom: 0, width: "30%" }}>
                      <Select placeholder="+91" allowClear>
                        {country.map((c) => (
                          <Option key={c.country_code ?? c.id} value={c.country_code ?? c.id}>
                            {c.country_code ?? c.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item name="phone" rules={[{ required: true }, { pattern: /^[0-9]{10}$/ }]} style={{ marginBottom: 0, width: "70%" }}>
                      <Input placeholder="Enter phone number" maxLength={10} inputMode="numeric" />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
                  <Input placeholder="Enter Email" allowClear />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="description" label="Description" rules={[{ max: 500 }]}>
                  <Input.TextArea placeholder="Enter Description" allowClear rows={3} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="address_line1" label="Address Line 1" rules={[{ required: true }]}>
                  <Input.TextArea rows={2} placeholder="Enter address line 1" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="address_line2" label="Address Line 2">
                  <Input.TextArea rows={2} placeholder="Enter address line 2" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                  <Select placeholder="Select country" onChange={(val) => { editForm.setFieldsValue({ state: undefined, city: undefined }); fetchState(val); }} loading={loading}>
                    {country.map((item) => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item name="state" label="State" rules={[{ required: true }]}>
                  <Select placeholder="Select state" onChange={(val) => { editForm.setFieldsValue({ city: undefined }); fetchCity(val); }} loading={loading} disabled={!stateList.length}>
                    {stateList.map((s) => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item name="city" label="City" rules={[{ required: true }]}>
                  <Select placeholder="Select city" loading={loading} disabled={!cityList.length}>
                    {cityList.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item name="pincode" label="Pincode" rules={[{ required: true }, { pattern: /^\d{6}$/ }]}>
                  <Input placeholder="Enter pincode" maxLength={6} inputMode="numeric" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <Select placeholder="Select status">
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                    <Option value="Closed">Closed</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end" gutter={8}>
              <Col><Button danger onClick={() => setIsEditModalOpen(false)}>Cancel</Button></Col>
              <Col><Button type="primary" htmlType="submit" loading={loading}>Update</Button></Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Branch;
