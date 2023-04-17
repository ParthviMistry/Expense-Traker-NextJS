import React, { useState } from "react";
import axios from "axios";

import {
  AppstoreOutlined,
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import {
  Breadcrumb,
  Button,
  Layout,
  Menu,
  theme,
  AutoComplete,
  Input,
} from "antd";

import ExpenseForm from "./ExpenseForm";
import ListAllData from "./ListAllData";

const { Header, Content, Sider } = Layout;

const items1 = ["Signin", "Signup"].map((key) => ({
  label: key,
}));

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

const items = [
  getItem("Dashboard", "1", <MailOutlined />),
  getItem("Transaction", "2", <CalendarOutlined />),
  getItem("Account", "3", <AppstoreOutlined />),
  getItem("Report", "4", <CalendarOutlined />),
  getItem("Setting", "5", <SettingOutlined />),
];

const SideBar = () => {
  const [addBook, setAddBook] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [options, setOptions] = useState([]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleSearch = async (value) => {
    setOptions(value ? searchResult(value) : []);
    await axios
      .get(`/api/expense/${value}`)
      .then((res) => {
        setOptions(value);
        console.log("res get--", res.data);
      })
      .catch((err) => {
        console.log("error in request", err);
      });
  };

  return (
    <Layout>
      <Header style={{ display: "flex" }}>
        {/* <div className="logo">APP</div> */}
        <div style={{ justifyContent: "center" }}>
          <AutoComplete
            dropdownMatchSelectWidth={252}
            style={{ width: 300 }}
            options={options}
            // onSelect={onSelect}
            onSearch={handleSearch}
          >
            <Input.Search
              size="large"
              placeholder="Search here..."
              enterButton
            />
          </AutoComplete>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items1}
        />
      </Header>

      <Layout style={{ height: "100vh" }}>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items}
          />
        </Sider>

        <Layout style={{ padding: "0 24px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "16px 0",
            }}
          >
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Button>Filter</Button>
            <Button onClick={() => setAddBook(!addBook)}>
              {!addBook ? "Add new book" : "Show List"}
            </Button>
          </div>

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {addBook ? (
              <ExpenseForm
                expenseData={expenseData}
                setExpenseData={setExpenseData}
              />
            ) : (
              <ListAllData
                expenseData={expenseData}
                setExpenseData={setExpenseData}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SideBar;
