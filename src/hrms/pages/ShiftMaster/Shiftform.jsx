import React, { useState, useEffect } from "react";

import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  TimePicker,
  Switch,
  message,
} from "antd";


import { useNavigate, useLocation } from "react-router-dom";

import dayjs from "dayjs";


import { shiftService } from "../../services/shift";


const Shiftform = () => {
  const [form] = Form.useForm();


  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();

  const { isEdit = false, initialValues = {} } = location.state || {};

  useEffect(() => {
    if (isEdit && initialValues && Object.keys(initialValues).length) {
      form.setFieldsValue({
        shift_name: initialValues.shift_name,

        shift_type: initialValues.shift_type,

        start_time: initialValues.start_time
          ? dayjs(initialValues.start_time, "HH:mm:ss")
          : null,

        end_time: initialValues.end_time
          ? dayjs(initialValues.end_time, "HH:mm:ss")
          : null,

        min_in_time: initialValues.min_in_time
          ? dayjs(initialValues.min_in_time, "HH:mm:ss")
          : null,

        max_out_time: initialValues.max_out_time
          ? dayjs(initialValues.max_out_time, "HH:mm:ss")
          : null,

        break_start_time: initialValues.break_start_time
          ? dayjs(initialValues.break_start_time, "HH:mm:ss")
          : null,

        break_end_time: initialValues.break_end_time
          ? dayjs(initialValues.break_end_time, "HH:mm:ss")
          : null,

        total_hours: initialValues.total_hours,

        is_night_shift: initialValues.is_night_shift || false,

        status: initialValues.status?.toLowerCase() || "inactive",
      });

    }
  }, [isEdit, initialValues, form]);


  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);

    const formatTime = (time) => (time ? dayjs(time).format("HH:mm:ss") : null);

    const data = {
      shift_name: values.shift_name,

      shift_type: values.shift_type,

      start_time: formatTime(values.start_time),

      end_time: formatTime(values.end_time),

      min_in_time: formatTime(values.min_in_time),

      max_out_time: formatTime(values.max_out_time),

      break_start_time: formatTime(values.break_start_time),

      break_end_time: formatTime(values.break_end_time),

      total_hours: values.total_hours,

      is_night_shift: values.is_night_shift || false,

      status: isEdit ? values.status?.toLowerCase() || "inactive" : "active", // Default to 'active' for new shifts
    };

    try {
      if (isEdit) {
        await shiftService.updateShift(initialValues.id, data);

        messageApi.success("Shift updated successfully");
      } else {
        await shiftService.createShift(data);

        messageApi.success("Shift created successfully");
      }

      form.resetFields();

      navigate("/hrms/pages/shift", {
        state: {
          message: isEdit
            ? "Shift updated successfully"
            : "Shift created successfully",
        },
      });
    } catch (error) {
      messageApi.error("Operation failed");

      console.error("Shift operation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}

      <div className="p-6 max-w-6xl mx-auto rounded">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Shift" : "Add Shift"}
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleFormSubmit}
          initialValues={{ status: "active", is_night_shift: false }}

        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item

                name="shift_name"
                label="Shift Name"
                rules={[{ required: true, message: "Please enter shift name" }]}
              >
                <Input placeholder="Enter Shift name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="shift_type"
                label="Shift Type"
                rules={[{ required: true, message: "Please enter shift type" }]}
              >
                <Input placeholder="Enter Shift type" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="start_time"
                label="Start Time"
                rules={[
                  { required: true, message: "Please select start time" },
                ]}
              >
                <TimePicker format="HH:mm:ss" className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="end_time"
                label="End Time"
                rules={[{ required: true, message: "Please select end time" }]}
              >
                <TimePicker format="HH:mm:ss" className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="break_start_time" label="Break Start Time">
                <TimePicker format="HH:mm:ss" className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="break_end_time" label="Break End Time">
                <TimePicker format="HH:mm:ss" className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="total_hours" label="Total Hours">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter total hours e.g. 8.5"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="min_in_time"
                label="Minimum In Time"
                rules={[
                  { required: true, message: "Please select minimum in time" },
                ]}
              >
                <TimePicker format="HH:mm:ss" className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="max_out_time"
                label="Maximum Out Time"
                rules={[
                  { required: true, message: "Please select maximum out time" },
                ]}
              >
                <TimePicker format="HH:mm:ss" className="w-full" />
              </Form.Item>
            </Col>
{/* 
            <Col xs={24} sm={12}>
              <Form.Item
                name="is_night_shift"
                label="Night Shift"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col> */}

            {isEdit && ( // Only show status field in edit mode
              <Col xs={24} sm={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Select placeholder="Select status">
                    <Select.Option value="active">Active</Select.Option>

                    <Select.Option value="inactive">Inactive</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
         
              danger
              onClick={() => navigate("/hrms/pages/shift")}

              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
 

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}

              className="w-full sm:w-auto"
            >
              Submit
            </Button>
          </div>
        </Form>

      </div>
    </>
  );
};

export default Shiftform;

