import React from "react";
import axios from "axios";

import { Form, Button, Select, Space, DatePicker } from "antd";

import PriceInput from "@/components/PriceInput";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const options = [
  { key: "salary", value: "Salary" },
  { key: "extraSalary", value: "Extra Salary" },
  { key: "gift", value: "Gift" },
  { key: "business", value: "Business" },
  { key: "sip", value: "SIP" },
  { key: "personal", value: "Personal" },
  { key: "home", value: "Home" },
  { key: "grocery", value: "Grocery" },
];

const ExpenseForm = ({ setExpenseData, show, data }) => {
  const [form] = Form.useForm();

  const GetAll = async () => {
    await axios
      .get("/api/expense")
      .then((res) => {
        setExpenseData(res.data);
      })
      .catch((err) => {
        console.log("error in request", err);
      });
  };

  const onReset = () => form.resetFields();

  const onFinish = async (values) => {
    !show && !data
      ? await axios
          .post("/api/expense", values)
          .then((res) => {
            console.log("res", res.data);
            setExpenseData(res.data);
          })
          .catch((err) => {
            console.log("error in request", err);
          })
      : await axios
          .put(`/api/expense/${data._id}`, values)
          .then((res) => {
            console.log("res", res.data);
            setExpenseData(res.data);
          })
          .catch((err) => {
            console.log("error in request", err);
          });

    await GetAll();
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onValuesChange = (values) => {
    console.log("onValuesChange:", values);
  };

  const checkPrice = (_, value) => {
    if (value.number > 0) return Promise.resolve();

    return Promise.reject(new Error("Price must be greater than zero!"));
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", padding: "20px" }}>Expense Tracker</h2>
      <Form
        {...layout}
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
      >
        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select
            placeholder="Select your expense type"
            // onChange={onTypeChange}
            allowClear
          >
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select your expense category"
            // onChange={onCategoryChange}
            allowClear
          >
            {options.map((i) => {
              return <Option value={i.key}>{i.value}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item name="date" label="DatePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ validator: checkPrice }]}
        >
          <PriceInput />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExpenseForm;
