import React, { useEffect, useState } from "react";
import { Modal, Popconfirm, Radio, Space, Table, Tag } from "antd";
import axios from "axios";
import ExpenseForm from "./ExpenseForm";

const ListAllData = ({ expenseData, setExpenseData }) => {
  const [show, setShow] = useState(false);
  const [data, setdata] = useState();

  useEffect(() => {
    GetAll();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => {
        return ++index;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (i) => <a>{i}</a>,
      filters: [
        {
          text: "Expense",
          value: "expense",
        },
        {
          text: "Income",
          value: "income",
        },
      ],
      onFilter: (value, i) => i.type.indexOf(value) === 0,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (p) => {
        return (
          <>
            <span>{p.number}</span>
            <span>-{p.currency}</span>
          </>
        );
      },
      key: "price",
    },
    {
      title: "Action",
      key: "action",
      render: (_, i) => (
        <Space size="middle">
          <div
            onClick={async () => {
              await axios
                .get(`/api/expense/${i._id}`)
                .then((res) => {
                  setShow(true);
                  setdata(i);
                  console.log("res get--", res.data);
                })
                .catch((err) => {
                  console.log("error in request", err);
                });
            }}
          >
            Edit {i.name}
          </div>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              handleDelete(i._id);
            }}
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
    //   {
    //     title: "Tags",
    //     key: "tags",
    //     dataIndex: "tags",
    //     render: (tags) => (
    //       <span>
    //         {tags.map((tag) => {
    //           let color = tag.length > 5 ? "geekblue" : "green";
    //           if (tag === "loser") {
    //             color = "volcano";
    //           }
    //           return (
    //             <Tag color={color} key={tag}>
    //               {tag.toUpperCase()}
    //             </Tag>
    //           );
    //         })}
    //       </span>
    //     ),
    //   },
  ];

  const handleDelete = async (id) => {
    await axios
      .delete(`/api/expense/${id}`)
      .then((res) => {
        console.log("res delete--", res.data);
        GetAll();
      })
      .catch((err) => {
        console.log("error in request", err);
      });
  };

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

  return (
    <div>
      <Radio.Group style={{ marginBottom: 10 }} />
      <Table columns={columns} dataSource={expenseData} />
      {show && (
        <>
          <Modal
            title="Expense Tracker"
            centered
            open={true}
            onCancel={() => setShow(false)}
          >
            <ExpenseForm show={show} setShow={setShow} data={data} />
          </Modal>
        </>
      )}
    </div>
  );
};

export default ListAllData;
