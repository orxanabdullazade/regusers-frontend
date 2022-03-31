import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import axios from "axios";
import { Table, Tag, Space } from "antd";

const RegUsers = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  useEffect(() => {
    fetchRecords(0);
  }, []);

  const columns = [
    {
      title: "Email",
      dataIndex: "loginName",
    },
    {
      title: "Email təsdiq",
      dataIndex: "status",
    },
    {
      title: "Telefon təsdiq",
      dataIndex: "mobileStatus",
    },
    {
      title: "#",
      dataIndex: "",
    },
  ];

  const fetchRecords = (page) => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/eregusers/?page=${page}&size=10`)
      .then((res) => {
        console.log(res.data.totalElements);
        setLoading(false);
        setDataSource(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  };

  if (error) {
    return <div>Error !!!</div>;
  } else {
    return (
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
          total:totalPages,
          onChange: (page) => {
            fetchRecords(page);
          },
        }}
      />
    );
  }
};

export default RegUsers;
