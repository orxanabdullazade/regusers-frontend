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
  const [isModal, setIsModal] = useState(false);
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
      render: (mobileStatus) => (
        <Tag color={mobileStatus == 9 ? "green" : "red"}>
          {mobileStatus == 9 ? "Təsdiq edilib" : "Təsdiq gözləyir"}
        </Tag>
      ),
    },
    {
      title: "",
      render: (record) => (
        <FormOutlined
          onClick={() => {
            editRegUser(record);
          }}
        />
      ),
    },
  ];

  const fetchRecords = (page) => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/eregusers/?page=${page}&size=8`)
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

  const editRegUser = (record) => {
    setIsModal(true);
    // console.log({...record});
    setEditingRegUser({ ...record });
  };

  const resetEditing = () => {
    setIsModal(false);
    setEditingRegUser(null);
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
            resetEditing();
          }}
          cancelText="Imtina"
          visible={isModal}
          onOk={() => {
            setIsModal(false);
          }}
          okText="Yadda saxla"
        >
          <Form labelCol={{ span: 6 }}>
            <Form.Item label="Email təsdiq" >
              <Switch onChange={(e)=>{
                setEditingRegUser(pre=>{
                  return {...pre,status:!editingRegUser?.status}
                })
              }} checked={editingRegUser?.status == 9 ? true : false} />
            </Form.Item>
            <Form.Item label="Telefon təsdiq">
              <Switch onChange={(e)=>{
                setEditingRegUser(pre=>{
                  return {...pre,mobileStatus:e.target.value}
                })
              }}  checked={editingRegUser?.mobileStatus == 9 ? true : false} />
            </Form.Item>
            <Form.Item label="Şifrə">
              <Input />
            </Form.Item>
            <Form.Item label="Şifrənin təkrarı">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
};

export default RegUsers;
