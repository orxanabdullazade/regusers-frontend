import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import axios from "axios";
import { Table, Tag, Modal, Form, Switch, Input } from "antd";
import { FormOutlined } from "@ant-design/icons";

const RegUsers = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRegUser, setEditingRegUser] = useState(null);
  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);

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
      render: (status) => (
        <Tag color={status == 9 ? "green" : "red"}>
          {status == 9 ? "Təsdiq edilib" : "Təsdiq gözləyir"}
        </Tag>
      ),
    },
    {
      title: "Telefon təsdiq",
      dataIndex: "mobileStatus",
      render: (status) => (
        <Tag color={status == 9 ? "green" : "red"}>
          {status == 9 ? "Təsdiq edilib" : "Təsdiq gözləyir"}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "re",
      render: (record) => (
        <FormOutlined
          onClick={() => {
            editRegUser(record);
          }}
        />
      ),
    },
  ];

  const editRegUser = (record) => {
    setIsEditing(true);
    console.log({...record});
    setEditingRegUser({ ...record });
  };

  const fetchRecords = (page) => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/eregusers/?page=${page}&size=8`)
      .then((res) => {
        setLoading(false);
        setDataSource(res.data.content);
        setTotalElements(res.data.totalElements);
        // setPage(res.data.page);
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
      <div>
        <Table
          rowKey={(record) => record.loginName}
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 8,
            total: totalElements,
            onChange: (page) => {
              fetchRecords(page - 1);
            },
          }}
        />
        <Modal
          onCancel={() => {
            setIsEditing(false);
          }}
          cancelText="Imtina"
          visible={isEditing}
          onOk={() => {
            setIsEditing(false);
          }}
          okText="Yadda saxla"
        >
          <Input value={editRegUser?.loginName} />
        </Modal>
      </div>
    );
  }
};

export default RegUsers;
