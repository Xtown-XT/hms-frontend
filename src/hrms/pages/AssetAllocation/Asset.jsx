import React, { useState, useMemo } from "react";
import { DatePicker, Modal, Tabs, Input, Button, Select, Space, message } from "antd";
import dayjs from "dayjs";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

const { Search } = Input;

export default function AssetMaster() {
  const [activeTab, setActiveTab] = useState("company");
  const [companyAssets, setCompanyAssets] = useState([]);
  const [companyForm, setCompanyForm] = useState({
    assetId: "",
    assetType: "",
    customAssetType: "",
    purchasedDate: "",
    serialNumber: "",
    model: "",
    condition: "",
    status: "",
    notes: "",
    value: "",
  });

  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const assetTypes = ["Laptop", "Desktop", "Mac", "Other"];
  const conditions = ["New", "Refurbished"];
  const statuses = ["Active", "Inactive", "Returned", "Lost"];
  const modelBrands = [
    "ACER", "APPLE", "HP", "DELL", "LENOVO", "MICROSOFT",
    "SAMSUNG", "MSI", "GIGABYTE", "TOSHIBA", "LG", "SONY", "ASUS",
  ];

  const formatDisplayDate = (date) => {
    if (!date) return "";
    return dayjs(date, "DD/MM/YYYY").isValid()
      ? dayjs(date, "DD/MM/YYYY").format("DD/MM/YYYY")
      : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const resetForm = () => {
    setCompanyForm({
      assetId: "",
      assetType: "",
      customAssetType: "",
      purchasedDate: "",
      serialNumber: "",
      model: "",
      condition: "",
      status: "",
      notes: "",
      value: "",
    });
    setErrors({});
    setEditIndex(null);
  };

  const handleAdd = () => {
    const newErrors = {};
    Object.keys(companyForm).forEach((key) => {
      if (key === "customAssetType" && companyForm.assetType !== "Other") return;
      if (!companyForm[key] || companyForm[key].toString().trim() === "") {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalAssetType =
      companyForm.assetType === "Other"
        ? companyForm.customAssetType
        : companyForm.assetType;

    const newAsset = {
      ...companyForm,
      assetType: finalAssetType,
      value: parseFloat(companyForm.value) || 0,
    };

    if (editIndex !== null) {
      const updated = [...companyAssets];
      updated[editIndex] = newAsset;
      setCompanyAssets(updated);
      message.success("Asset updated successfully");
    } else {
      setCompanyAssets([...companyAssets, newAsset]);
      message.success("Asset added successfully");
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setCompanyForm(companyAssets[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    setCompanyAssets((prev) => prev.filter((_, i) => i !== index));
    message.success("Asset deleted");
  };

  const filteredData = useMemo(() => {
    const filtered = companyAssets.filter((a) => {
      const matchesSearch =
        (a.assetId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.serialNumber || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "All" ? true : a.assetType === filterType;
      return matchesSearch && matchesFilter;
    });
    return filtered;
  }, [companyAssets, searchQuery, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCompanyValue = companyAssets.reduce(
    (acc, a) => acc + (a.value || 0),
    0
  );

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      {/* ======= TABS ======= */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          resetForm();
        }}
        items={[
          { label: "Company Assets", key: "company" },
          { label: "Employee Assets", key: "employee" },
        ]}
      />

      {/* ======= HEADER SECTION ======= */}
      <div className="w-full flex flex-wrap items-start justify-between gap-4 mb-6 mt-4">
        <h1 className="font-semibold text-xl">
          {activeTab === "company" ? "Company Assets" : "Employee Assets"}
        </h1>

        {/* ===== Search + Filter + Add ===== */}
        <Space size="middle" className="flex flex-wrap justify-end">
          <Search
            placeholder="Search by ID or Serial..."
            allowClear
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 250 }}
          />

          <Select
            value={filterType}
            onChange={(val) => {
              setFilterType(val);
              setCurrentPage(1);
            }}
            style={{ width: 180 }}
            options={[
              { label: "All Types", value: "All" },
              ...assetTypes.map((t) => ({ label: t, value: t })),
            ]}
          />

          {activeTab === "company" && (
            <Button
              type="primary"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-purple-500 text-white rounded-lg shadow-md"
            >
              + Add Asset
            </Button>
          )}
        </Space>
      </div>

      {/* ======= TABLE ======= */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              {activeTab === "employee" && (
                <>
                  <th className="border border-gray-100 p-4 text-left">Employee ID</th>
                  <th className="border border-gray-100 p-4 text-left">Employee Name</th>
                </>
              )}
              <th className="border border-gray-100 p-4 text-left">Asset ID</th>
              <th className="border border-gray-100 p-4 text-left">Asset Type</th>
              <th className="border border-gray-100 p-4 text-left">Serial</th>
              <th className="border border-gray-100 p-4 text-left">Model</th>
              <th className="border border-gray-100 p-4 text-left">Condition</th>
              <th className="border border-gray-100 p-4 text-left">Status</th>
              <th className="border border-gray-100 p-4 text-left">Purchased</th>
              <th className="border border-gray-100 p-4 text-left">Value</th>
              <th className="border border-gray-100 p-4 text-left">Notes</th>
              {activeTab === "company" && (
                <th className="border border-gray-100 p-4 text-left">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((a, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-gray-700 transition">
                  {activeTab === "employee" && (
                    <>
                      <td className="border p-3">{a.employeeId || "-"}</td>
                      <td className="border p-3">{a.employeeName || "-"}</td>
                    </>
                  )}
                  <td className="border p-3 font-semibold text-[#408CFF] underline cursor-pointer">
                    {a.assetId}
                  </td>
                  <td className="border p-3">{a.assetType}</td>
                  <td className="border p-3">{a.serialNumber}</td>
                  <td className="border p-3">{a.model}</td>
                  <td className="border p-3">{a.condition}</td>
                  <td className="border p-3">{a.status}</td>
                  <td className="border p-3">{formatDisplayDate(a.purchasedDate)}</td>
                  <td className="border p-3">₹{a.value}</td>
                  <td className="border p-3">{a.notes}</td>
                  {activeTab === "company" && (
                    <td className="border p-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(idx)}
                          className="p-2 bg-black text-white rounded hover:scale-105 transition"
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-2 bg-red-500 text-white rounded hover:scale-105 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={activeTab === "company" ? 10 : 11}
                  className="text-center p-6 text-gray-400 italic"
                >
                  No assets found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {activeTab === "company" && (
          <div className="mt-3 font-bold text-gray-700">
            Total Asset Value: ₹{totalCompanyValue.toLocaleString()}
          </div>
        )}
      </div>

      {/* ======= PAGINATION ======= */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <div className="px-4 py-2 border rounded">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* ======= MODAL ======= */}
      {activeTab === "company" && isModalOpen && (
        <Modal
          title={editIndex !== null ? "Edit Asset" : "Add Asset"}
          open={isModalOpen}
          onCancel={() => {
            resetForm();
            setIsModalOpen(false);
          }}
          footer={null}
          width={800}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Asset ID", name: "assetId", type: "text" },
              { label: "Asset Type", name: "assetType", type: "select", options: assetTypes },
              {
                label: "Custom Asset Type",
                name: "customAssetType",
                type: "text",
                condition: companyForm.assetType === "Other",
              },
              { label: "Purchased Date", name: "purchasedDate", type: "date" },
              { label: "Serial Number", name: "serialNumber", type: "text" },
              { label: "Model", name: "model", type: "modelSelect" },
              { label: "Condition", name: "condition", type: "select", options: conditions },
              { label: "Status", name: "status", type: "select", options: statuses },
              { label: "Value", name: "value", type: "number" },
            ].map((field) => {
              if (field.name === "customAssetType" && !field.condition) return null;
              return (
                <div key={field.name}>
                  <label className="font-semibold">{field.label}</label>
                  {field.type === "text" || field.type === "number" ? (
                    <Input
                      type={field.type}
                      name={field.name}
                      value={companyForm[field.name]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label}`}
                    />
                  ) : field.type === "modelSelect" ? (
                    <Select
                      value={companyForm.model}
                      onChange={(value) => setCompanyForm((prev) => ({ ...prev, model: value }))}
                      options={modelBrands.map((brand) => ({ label: brand, value: brand }))}
                      placeholder="Select Model"
                      className="w-full"
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={companyForm[field.name]}
                      onChange={(value) =>
                        setCompanyForm((prev) => ({ ...prev, [field.name]: value }))
                      }
                      options={field.options.map((opt) => ({ label: opt, value: opt }))}
                      placeholder={`Select ${field.label}`}
                      className="w-full"
                    />
                  ) : field.type === "date" ? (
                    <DatePicker
                      format="DD/MM/YYYY"
                      value={
                        companyForm[field.name]
                          ? dayjs(companyForm[field.name], "DD/MM/YYYY")
                          : null
                      }
                      onChange={(date, ds) =>
                        setCompanyForm((prev) => ({ ...prev, [field.name]: ds }))
                      }
                      className="w-full"
                    />
                  ) : null}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm">{errors[field.name]}</p>
                  )}
                </div>
              );
            })}

            <div className="col-span-2">
              <label className="font-semibold">Notes</label>
              <Input.TextArea
                name="notes"
                value={companyForm.notes}
                onChange={handleChange}
                placeholder="Add notes"
              />
              {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleAdd}>
              {editIndex !== null ? "Update" : "Add"} Asset
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
