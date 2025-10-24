import React from "react";
import {
    Card,
    Form,
    Input,
    DatePicker,
    Select,
    Checkbox,
    Button,
    message,
    Upload,
    Collapse ,
} from "antd";
import {
    PlusOutlined,
    UploadOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;
const BasicDetailsCard = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleUpload = (info) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
    message.success("Profile picture uploaded successfully");}
  };
const Employeepersonal = () => {
    const [form] = Form.useForm();

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // Format dates
            const dateFields = [
                "joiningDate",
                "dob",
                "educationStartDate",
                "educationEndDate",
                "experienceStartDate",
                "experienceEndDate",
                "assetIssuedDate",
                "assetReturnDate",
            ];
            dateFields.forEach((field) => {
                if (values[field]) values[field] = values[field].format("YYYY-MM-DD");
            });

            message.success("Employee data saved!");
            console.log("Saved values:", values);
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };

    const handlePinCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        form.setFieldsValue({ pinCode: value });
    };

    const uploadProps = (fieldName) => ({
        beforeUpload: (file) => {
            const isAllowed =
                file.type === "application/pdf" || file.type.startsWith("image/");
            if (!isAllowed) {
                message.error("Only PDF or image files are allowed!");
                return Upload.LIST_IGNORE;
            }
            form.setFieldsValue({ [fieldName]: file });
            return false;
        },
        showUploadList: false,
    });

    const renderUploadedFile = (fieldName) => {
        const file = form.getFieldValue(fieldName);
        if (!file) return null;
        const url = typeof file === "string" ? file : URL.createObjectURL(file);
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 block mt-2"
            >
                View Uploaded File
            </a>
        );
    };

    return (
        <div className="p-4 bg-gray-50">
            <Form form={form} layout="vertical">
                {/* GRID: TWO CARDS PER ROW */}
                 {/* Basic Details Section */}
  <Card
  bordered
  title={<span className="font-semibold text-xl">Basic Details</span>}
>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item name="attendanceId" label="Attendance ID"><Input /></Form.Item>
                  <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item name="dateOfJoining" label="Date of Joining"><DatePicker style={{ width: "100%" }} /></Form.Item>
                  <Form.Item name="reportingManager" label="Reporting Manager"><Input /></Form.Item>
                  <Form.Item name="employeeType" label="Employee Type">
                    <Select placeholder="Select Type">
                      <Option value="permanent">Permanent</Option>
                      <Option value="contract">Contract</Option>
                      <Option value="intern">Intern</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="status" label="Status">
                    <Select placeholder="Select Status">
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="shiftType" label="Shift Type"><Input /></Form.Item>
    </div>
  </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PERSONAL INFORMATION */}
                 <Card
  bordered
  title={<span className="font-semibold text-xl">Personal Information</span>}
>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item
    name="employeeId"
    label={<span className="text-gray-600">Employee ID</span>}
    rules={[{ required: true, message: "Please enter Employee ID" }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    name="attendanceId"
    label={<span className="text-gray-600">Attendance ID</span>}
    rules={[{ required: true, message: "Please enter Attendance ID" }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    name="firstName"
    label={<span className="text-gray-600">First Name</span>}
    rules={[{ required: true, message: "Please enter First Name" }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    name="lastName"
    label={<span className="text-gray-600">Last Name</span>}
    rules={[{ required: true, message: "Please enter Last Name" }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    name="dob"
    label={<span className="text-gray-600">Date of Birth</span>}
    rules={[{ required: true, message: "Please select Date of Birth" }]}
  >
    <DatePicker style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item
    name="gender"
    label={<span className="text-gray-600">Gender</span>}
    rules={[{ required: true, message: "Please select Gender" }]}
  >
    <Select placeholder="Select">
      <Option value="male">Male</Option>
      <Option value="female">Female</Option>
      <Option value="other">Other</Option>
    </Select>
  </Form.Item>

  <Form.Item
    name="maritalStatus"
    label={<span className="text-gray-600">Marital Status</span>}
    rules={[{ required: true, message: "Please select Marital Status" }]}
  >
    <Select placeholder="Select">
      <Option value="single">Single</Option>
      <Option value="married">Married</Option>
    </Select>
  </Form.Item>

  <Form.Item
    name="bloodGroup"
    label={<span className="text-gray-600">Blood Group</span>}
    rules={[{ required: true, message: "Please enter Blood Group" }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="nationality"
    label={<span className="text-gray-600">Nationality</span>}
    rules={[{ required: true, message: "Please enter Nationality" }]}
  >
    <Input />
  </Form.Item>
</div>

     
    </Card>
{/* CONTACT DETAILS */}
<Card
  bordered
  title={<span className="font-semibold text-xl">Contact Details</span>}
>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item
    name="permanentAddress"
    label={<span className="text-gray-600">Permanent Address</span>}
    rules={[{ required: true }]}
  >
    <Input.TextArea />
  </Form.Item>

  <Form.Item name="sameAsPermanent" valuePropName="checked">
    <Checkbox
      onChange={(e) => {
        if (e.target.checked) {
          form.setFieldsValue({
            currentAddress: form.getFieldValue("permanentAddress"),
          });
        } else {
          form.setFieldsValue({ currentAddress: "" });
        }
      }}
    >
      Same as Permanent
    </Checkbox>
  </Form.Item>

  <Form.Item
    name="currentAddress"
    label={<span className="text-gray-600">Current Address</span>}
    rules={[{ required: true }]}
  >
    <Input.TextArea />
  </Form.Item>

  <Form.Item name="city" label={<span className="text-gray-600">City</span>} rules={[{ required: true }]}>
    <Input />
  </Form.Item>

  <Form.Item name="state" label={<span className="text-gray-600">State</span>} rules={[{ required: true }]}>
    <Input />
  </Form.Item>

  <Form.Item
    name="pinCode"
    label={<span className="text-gray-600">Pin Code</span>}
    rules={[{ required: true }]}
  >
    <Input
      maxLength={6}
      onChange={async (e) => {
        const value = e.target.value.replace(/\D/g, "");
        form.setFieldsValue({ pinCode: value });

        if (value.length === 6) {
          try {
            const response = await fetch(
              `https://api.postalpincode.in/pincode/${value}`
            );
            const data = await response.json();
            if (
              data[0].Status === "Success" &&
              data[0].PostOffice &&
              data[0].PostOffice.length > 0
            ) {
              const postOffice = data[0].PostOffice[0];
              form.setFieldsValue({
                city: postOffice.District,
                state: postOffice.State,
              });
            } else {
              form.setFieldsValue({ city: "", state: "" });
              message.error("Invalid Pin Code or data not found");
            }
          } catch (error) {
            console.error(error);
            message.error("Failed to fetch City/State");
          }
        } else {
          form.setFieldsValue({ city: "", state: "" });
        }
      }}
    />
  </Form.Item>

  <Form.Item
    name="mobileNumber"
    label={<span className="text-gray-600">Mobile Number</span>}
    rules={[
      { required: true, message: "Please enter Mobile Number" },
      { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
    ]}
  >
    <Input
      addonBefore="+91"
      maxLength={10}
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
      }}
    />
  </Form.Item>

  <Form.Item
    name="email"
    label={<span className="text-gray-600">Email</span>}
    rules={[{ required: true, type: "email" }]}
  >
    <Input />
  </Form.Item>
</div>

</Card>
{/* EMERGENCY DETAILS */}
<Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold">Emergency Details</span>}
>
  <Form.List name="emergencyContacts" initialValue={[{}]}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...rest }) => (
          <div
  key={key}
  className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4 rounded-lg bg-gray-50 relative p-4"
>
  {/* Remove Icon (top-right corner) */}
  <Button
    type="text"
    danger
    icon={<MinusCircleOutlined />}
    onClick={() => remove(name)}
    style={{
      position: "absolute",
      top: 8,
      right: 8,
    }}
  />

  <Form.Item
    {...rest}
    name={[name, "contactName"]}
    label={<span className="text-gray-600">Name</span>}
    rules={[{ required: true, message: "Please enter Name" }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    {...rest}
    name={[name, "relationship"]}
    label={<span className="text-gray-600">Relationship</span>}
    rules={[{ required: true, message: "Please enter Relationship" }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    {...rest}
    name={[name, "phoneNumber"]}
    label={<span className="text-gray-600">Phone Number</span>}
    rules={[
      { required: true, message: "Please enter Phone Number" },
      {
        pattern: /^[0-9]{10}$/,
        message: "Enter a valid 10-digit number",
      },
    ]}
  >
    <Input
      addonBefore="+91"
      maxLength={10}
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
      }}
    />
  </Form.Item>

  <Form.Item
    {...rest}
    name={[name, "address"]}
    label={<span className="text-gray-600">Address</span>}
    rules={[{ required: true, message: "Please enter Address" }]}
  >
    <Input.TextArea rows={1} />
  </Form.Item>
</div>

        ))}

        {/* Add new contact icon only */}
        <div className="flex justify-center mt-2">
          <PlusOutlined
            onClick={() => add()}
            style={{
              fontSize: 22,
              color: "#7C3AED",
              cursor: "pointer",
               
                position: "absolute",
                top: 8,
                right: 8,
              }}
           
          />
        </div>
      </>
    )}
  </Form.List>
</Card>

                    {/* JOB DETAILS */}
                   <Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold ">Job Details</span>}
><div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item name="designation" label={<span className="text-gray-600">Designation</span>} rules={[{ required: true }]}>
    <Input />
  </Form.Item>

  <Form.Item name="department" label={<span className="text-gray-600">Department</span>} rules={[{ required: true }]}>
    <Input />
  </Form.Item>

  <Form.Item name="manager" label={<span className="text-gray-600">Reporting Manager</span>} rules={[{ required: true }]}>
    <Input />
  </Form.Item>

  <Form.Item name="employeeType" label={<span className="text-gray-600">Employee Type</span>} rules={[{ required: true }]}>
    <Select placeholder="Select Type">
      <Option value="full-time">Permanent</Option>
      <Option value="part-time">Contract</Option>
      <Option value="intern">Intern</Option>
    </Select>
  </Form.Item>

  <Form.Item name="joiningDate" label={<span className="text-gray-600">Date of Joining</span>} rules={[{ required: true }]}>
    <DatePicker style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item name="location" label={<span className="text-gray-600">Location</span>} rules={[{ required: true }]}>
    <Input />
  </Form.Item>

  <Form.Item name="shift" label={<span className="text-gray-600">Shift</span>} rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</div>

                    </Card>

                    {/* GOVERNMENT DETAILS */}
                         <Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold">Government Details</span>}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item
    name="aadhaar"
    label={<span className="text-gray-600">Aadhaar No</span>}
    rules={[{ required: true, message: "Please enter Aadhaar Number" }]}
  >
    <Input
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault(); // ❌ Block letters/symbols
        }
      }}
    />
  </Form.Item>

  <Form.Item
    name="panNumber"
    label={<span className="text-gray-600">PAN Number</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="pf"
    label={<span className="text-gray-600">Provident Fund (PF) / ESI / SSN</span>}
    rules={[{ required: true, message: "Please enter PF/ESI/SSN Number" }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="tax"
    label={<span className="text-gray-600">Tax Category / TDS Information</span>}
    rules={[{ required: true, message: "Please enter Tax/TDS Information" }]}
  >
    <Input />
  </Form.Item>
</div>

                    </Card>

                    {/* BANK DETAILS */}
                    <Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold">Bank Details</span>}>
                      
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item
    name="bankName"
    label={<span className="text-gray-600">Bank Name</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="account no"
    label={<span className="text-gray-600">Account No</span>}
    rules={[{ required: true, message: "Please enter Account No" }]}
  >
    <Input
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault(); // ❌ Block letters/symbols
        }
      }}
    />
  </Form.Item>

  <Form.Item
    name="ifscCode"
    label={<span className="text-gray-600">IFSC Code</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="branchName"
    label={<span className="text-gray-600">Branch Name</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>
</div>

                    </Card>

                    {/* EDUCATION DETAILS */}
                     <Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold">Eductaional Details</span>}>
                         
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item
    name="qualification"
    label={<span className="text-gray-600">Qualification</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="specialization"
    label={<span className="text-gray-600">Specialization</span>}
    rules={[{ required: true, message: "Please enter your Specialization" }]}
  >
    <Input placeholder="e.g. Computer Science, Marketing" />
  </Form.Item>

  <Form.Item
    name="university"
    label={<span className="text-gray-600">University / Board</span>}
    rules={[{ required: true, message: "Please enter your University / Board" }]}
  >
    <Input placeholder="e.g. Anna University, CBSE" />
  </Form.Item>

  <Form.Item
    name="institution"
    label={<span className="text-gray-600">Institution</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="educationStartDate"
    label={<span className="text-gray-600">Start Date</span>}
  >
    <DatePicker picker="month" style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item
    name="educationEndDate"
    label={<span className="text-gray-600">End Date</span>}
  >
    <DatePicker picker="month" style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item
    name="percentage"
    label={<span className="text-gray-600">Percentage / GPA / CGPA</span>}
    rules={[{ required: true, message: "Please enter your Percentage / GPA / CGPA" }]}
  >
    <Input placeholder="e.g. 85% or 8.5 CGPA" />
  </Form.Item>

  <Form.Item
    name="additionalCourses"
    label={<span className="text-gray-600">Additional Courses (if any)</span>}
    rules={[{ required: true, message: "Please enter Additional Courses or write N/A" }]}
  >
    <Input.TextArea rows={2} placeholder="e.g. Data Science, Cloud Computing" />
  </Form.Item>
</div>

                    </Card>

                    {/* EXPERIENCE DETAILS */}
                     <Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold">Experience Details</span>}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item
    name="companyName"
    label={<span className="text-gray-600">Company Name</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="expDesignation"
    label={<span className="text-gray-600">Designation</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="department"
    label={<span className="text-gray-600">Department</span>}
    rules={[{ required: true, message: "Please enter your Department" }]}
  >
    <Input placeholder="e.g. IT, HR, Finance" />
  </Form.Item>

  <Form.Item
    name="location"
    label={<span className="text-gray-600">Location</span>}
    rules={[{ required: true, message: "Please enter your Work Location" }]}
  >
    <Input placeholder="e.g. Chennai, Bangalore" />
  </Form.Item>

  <Form.Item
    name="experienceStartDate"
    label={<span className="text-gray-600">Start Date</span>}
  >
    <DatePicker picker="month" style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item
    name="experienceEndDate"
    label={<span className="text-gray-600">End Date</span>}
  >
    <DatePicker picker="month" style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item
    name="achievements"
    label={<span className="text-gray-600">Key Achievements / Responsibilities</span>}
    rules={[{ required: true, message: "Please enter your Key Achievements / Responsibilities" }]}
  >
    <Input.TextArea rows={3} placeholder="" />
  </Form.Item>
</div>

                    </Card>

                    {/* PAYROLL DETAILS */}
                   <Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold">Payroll Details</span>}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item
    name="basicSalary"
    label={<span className="text-gray-600">Basic Salary</span>}
    rules={[{ required: true }]}
  >
    <Input prefix="₹" />
  </Form.Item>

  <Form.Item
    name="allowanceType"
    label={<span className="text-gray-600">Allowances</span>}
    rules={[{ required: true, message: "Please select an allowance type" }]}
  >
    <Select placeholder="Select Allowance Type">
      <Option value="hra">HRA (House Rent Allowance)</Option>
      <Option value="da">DA (Dearness Allowance)</Option>
      <Option value="medical">Medical Allowance</Option>
      <Option value="conveyance">Conveyance Allowance</Option>
    </Select>
  </Form.Item>

  <Form.Item
    name="bonus/incentives"
    label={<span className="text-gray-600">Bonus/Incentives</span>}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="deductions"
    label={<span className="text-gray-600">Deductions</span>}
    rules={[{ required: true, message: "Please select or enter a deduction" }]}
  >
    <Select
      mode="tags"
      style={{ width: "100%" }}
      placeholder="Select or type a other deduction"
    >
      <Option value="pf">Provident Fund (PF)</Option>
      <Option value="tax">Tax</Option>
      <Option value="insurance">Insurance</Option>
      <Option value="loan">Loan</Option>
    </Select>
  </Form.Item>

  <Form.Item
    name="net salary"
    label={<span className="text-gray-600">Net Salary</span>}
  >
    <Input />
  </Form.Item>
</div>
                    </Card>

                    {/* DOCUMENT UPLOAD */}
                    <Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold">Document Upload</span>}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
  <Form.Item label={<span className="text-gray-600">Resume</span>}>
    <Upload {...uploadProps("resumeUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Resume/CV
      </Button>
    </Upload>
    {renderUploadedFile("resumeUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Aadhar</span>}>
    <Upload {...uploadProps("offerLetterUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Aadhar
      </Button>
    </Upload>
    {renderUploadedFile("offerLetterUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">PAN</span>}>
    <Upload {...uploadProps("idProofUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload PAN
      </Button>
    </Upload>
    {renderUploadedFile("idProofUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Degree Certificate</span>}>
    <Upload {...uploadProps("DegreeUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Degree
      </Button>
    </Upload>
    {renderUploadedFile("DegreeUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Marksheet</span>}>
    <Upload {...uploadProps("MarksheetUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Marksheet
      </Button>
    </Upload>
    {renderUploadedFile("MarksheetUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Document Upload</span>}>
    <Upload {...uploadProps("RelievingUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Relieving Letter
      </Button>
    </Upload>
    {renderUploadedFile("RelievingUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Experience Letter</span>}>
    <Upload {...uploadProps("Experience LetterUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Experience Letter
      </Button>
    </Upload>
    {renderUploadedFile("Experience LetterUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Offer Letter</span>}>
    <Upload {...uploadProps("Offer Letter Upload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Offer Letter
      </Button>
    </Upload>
    {renderUploadedFile("Offer LetterUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Passport</span>}>
    <Upload {...uploadProps("idProofUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Passport
      </Button>
    </Upload>
    {renderUploadedFile("idProofUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Driving License</span>}>
    <Upload {...uploadProps("idProofUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Driving License
      </Button>
    </Upload>
    {renderUploadedFile("idProofUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Address Proof</span>}>
    <Upload {...uploadProps("idProofUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Address Proof
      </Button>
    </Upload>
    {renderUploadedFile("idProofUpload")}
  </Form.Item>

  <Form.Item label={<span className="text-gray-600">Bank Proof</span>}>
    <Upload {...uploadProps("idProofUpload")}>
      <Button icon={<UploadOutlined />} className="text-gray-600">
        Upload Bank Proof
      </Button>
    </Upload>
    {renderUploadedFile("idProofUpload")}
  </Form.Item>
</div>

                    </Card>

                    {/* ASSETS DETAILS */}
                    <Card
  bordered
  title={<span className="text-xl text-gray-800 font-bold">Asset Details</span>}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
  <Form.Item
    name="employeeId"
    label={<span className="text-gray-600">Employee ID</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="assetType"
    label={<span className="text-gray-600">Asset Type</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="assetId"
    label={<span className="text-gray-600">Model</span>}
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="assetIssuedDate"
    label={<span className="text-gray-600">Issued Date</span>}
  >
    <DatePicker style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item
    name="assetReturnDate"
    label={<span className="text-gray-600">Return Date</span>}
  >
    <DatePicker style={{ width: "100%" }} />
  </Form.Item>
</div>

                    </Card>
                </div>

                {/* SAVE BUTTON */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button onClick={() => form.resetFields()}>Cancel</Button>
                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Employeepersonal;
