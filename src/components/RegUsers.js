import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import axios from "axios";
import { Table, Tag, Space } from "antd";

const RegUsers = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState([]);

  useEffect(() => {
    fetchRecords(1);
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
      .get(`http://localhost:8080/eregusers/?page=${page}&size=1`)
      .then((res) => {
        console.log(res.data.totalElements);
        setLoading(false);
        setDataSource(res.data.content);
        setTotalElements(res.data.totalElements);
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
          pageSize: 1,
          total:totalElements,
          onChange: (page) => {
            fetchRecords(page);
          },
        }}
      />
    );
  }
};

export default RegUsers;
