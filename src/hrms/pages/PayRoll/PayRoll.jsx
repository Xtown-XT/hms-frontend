import React, { useState, useMemo } from "react";
import {
  Modal,
  Dropdown,
  Menu,
  Button,
  Input,
  Select,
  message,
} from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Search } = Input;

export default function PayrollMaster() {
  const [records] = useState([
    {
      employeeId: "EMP001",
      employeeName: "John Doe",
      basicSalary: 50000,
      allowance: "Medical",
      deduction: "PF",
      bonus: 2000,
      bankName: "HDFC Bank",
      accountNo: "1234567890",
      ifsc: "HDFC0001234",
      accountHolderName: "John Doe",
      netSalary: 53000,
    },
    {
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      basicSalary: 60000,
      allowance: "Conveyance",
      deduction: "Tax",
      bonus: 3000,
      bankName: "ICICI Bank",
      accountNo: "9876543210",
      ifsc: "ICIC0005678",
      accountHolderName: "Jane Smith",
      netSalary: 63000,
    },
    {
      employeeId: "EMP003",
      employeeName: "Robert Johnson",
      basicSalary: 45000,
      allowance: "Medical",
      deduction: "ESI",
      bonus: 1000,
      bankName: "SBI",
      accountNo: "1122334455",
      ifsc: "SBIN0009876",
      accountHolderName: "Robert Johnson",
      netSalary: 48000,
    },
  ]);

  const [viewRecord, setViewRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ====== Download Single Employee ======
  const downloadEmployee = (record) => {
    const content = `
Employee ID: ${record.employeeId}
Name: ${record.employeeName}
Basic Salary: ${record.basicSalary}
Allowance: ${record.allowance}
Deduction: ${record.deduction}
Bonus/Incentive: ${record.bonus}
Net Salary: ${record.netSalary}

Bank Details:
Bank Name: ${record.bankName}
Account Number: ${record.accountNo}
IFSC: ${record.ifsc}
Account Holder Name: ${record.accountHolderName}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${record.employeeName}_Payroll.txt`;
    link.click();
    message.success(`${record.employeeName}'s payroll downloaded`);
  };

  // ====== Download All Payrolls ======
  const downloadAll = () => {
    let content = "";
    records.forEach((r) => {
      content += `
Employee ID: ${r.employeeId}
Name: ${r.employeeName}
Basic Salary: ${r.basicSalary}
Allowance: ${r.allowance}
Deduction: ${r.deduction}
Bonus/Incentive: ${r.bonus}
Net Salary: ${r.netSalary}

Bank Details:
Bank Name: ${r.bankName}
Account Number: ${r.accountNo}
IFSC: ${r.ifsc}
Account Holder Name: ${r.accountHolderName}
----------------------------
`;
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "All_Payroll.txt";
    link.click();
    message.success("All payrolls downloaded successfully");
  };

  // ====== Filters ======
  const allowances = ["All", "Medical", "Conveyance"];
  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterType === "All" ? true : r.allowance === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [records, searchQuery, filterType]);

  // ====== Pagination ======
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRecords = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      {/* ======= HEADER ======= */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-semibold">Payroll Master</h1>

        <div className="flex flex-wrap justify-end gap-3">
          <Search
            placeholder="Search by ID or Name"
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
            options={allowances.map((a) => ({ label: a, value: a }))}
          />

          <Button
            type="primary"
            onClick={downloadAll}
            icon={<DownloadOutlined />}
            className="bg-purple-500 text-white rounded-lg shadow-md"
          >
            Download All
          </Button>
        </div>
      </div>

      {/* ======= TABLE ======= */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-100 p-4 text-left">Employee ID</th>
              <th className="border border-gray-100 p-4 text-left">Name</th>
              <th className="border border-gray-100 p-4 text-center">Basic Salary</th>
              <th className="border border-gray-100 p-4 text-center">Allowance</th>
              <th className="border border-gray-100 p-4 text-center">Deduction</th>
              <th className="border border-gray-100 p-4 text-center">Bonus/Incentive</th>
              <th className="border border-gray-100 p-4 text-center">Net Salary</th>
              <th className="border border-gray-100 p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((r, idx) => {
                const menu = (
                  <Menu>
                    <Menu.Item
                      icon={<EyeOutlined />}
                      onClick={() => {
                        setViewRecord(r);
                        setIsModalOpen(true);
                      }}
                    >
                      View Bank Details
                    </Menu.Item>
                    <Menu.Item
                      icon={<DownloadOutlined />}
                      onClick={() => downloadEmployee(r)}
                    >
                      Download Slip
                    </Menu.Item>
                  </Menu>
                );

                return (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 text-gray-700 transition"
                  >
                    <td className="p-3">{r.employeeId}</td>
                    <td className="p-3 font-medium">{r.employeeName}</td>
                    <td className="p-3 text-center">{r.basicSalary}</td>
                    <td className="p-3 text-center">{r.allowance}</td>
                    <td className="p-3 text-center">{r.deduction}</td>
                    <td className="p-3 text-center">{r.bonus}</td>
                    <td className="p-3 text-center font-semibold text-green-600">
                      {r.netSalary}
                    </td>
                    <td className="p-3 text-center">
                      <Dropdown
                        overlay={menu}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-400 italic">
                  No payroll records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ======= PAGINATION ======= */}
      {filtered.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <div className="px-4 py-2 border rounded">
              {currentPage} / {totalPages}
            </div>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ======= BANK DETAILS MODAL ======= */}
      <Modal
        title="Bank Details"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setViewRecord(null);
        }}
        footer={null}
        width={600}
      >
        {viewRecord && (
          <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
            <p>
              <strong>Bank Name:</strong> {viewRecord.bankName}
            </p>
            <p>
              <strong>Account No:</strong> {viewRecord.accountNo}
            </p>
            <p>
              <strong>IFSC:</strong> {viewRecord.ifsc}
            </p>
            <p>
              <strong>Account Holder:</strong> {viewRecord.accountHolderName}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
