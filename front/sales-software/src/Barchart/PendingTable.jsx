import React from "react";
import { Space, Table, Tag } from "antd";

const columns = [
  {
    title: "S.NO",
    dataIndex: "sno", // Corrected dataIndex
    key: "sno",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Amount",
    dataIndex: "amount", // Ensure this exists in data
    key: "amount",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags &&
          tags.map((tag) => {
            let color = tag.length > 5 ? "red" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
      </>
    ),
  },

];

const data = [
  {
    sno: "1", // Changed from S.No to sno to match columns
    key: "1",
    name: "John Brown",
    amount: 100, // Added Amount field
    tags: ["Paid", "Pending"],
  },
  {
    sno: "2",
    key: "2",
    name: "Jim Green",
    amount: 200,
    tags: ["Pending"],
  },
  {
    sno: "3",
    key: "3",
    name: "Joe Black",
    amount: 150,
    tags: ["Paid"],
  },
];

const App = () => <Table columns={columns} style={{marginTop:'20px'}} dataSource={data} />;

export default App;
