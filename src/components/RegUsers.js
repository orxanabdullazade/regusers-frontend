import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Modal,
  Form,
  Switch,
  Input,
  message,
  Space,
  Button,
} from "antd";
import { FormOutlined } from "@ant-design/icons";
import md5 from "md5";

const RegUsers = () => {
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState(1);
  const [isModal, setIsModal] = useState(false);
  const [editingRegUser, setEditingRegUser] = useState(null);
  const [search, setSearch] = useState(null);
  const [form] = Form.useForm();

  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchRecords(currentPage);
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
        <Tag color={status === 9 ? "green" : "red"}>
          {status === 9 ? "Təsdiq edilib" : "Təsdiq gözləyir"}
        </Tag>
      ),
    },
    {
      title: "Telefon təsdiq",
      dataIndex: "mobileStatus",
      render: (mobileStatus) => (
        <Tag color={mobileStatus === 9 ? "green" : "red"}>
          {mobileStatus === 9 ? "Təsdiq edilib" : "Təsdiq gözləyir"}
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

  const searchRecords = (loginName) => {
    axios
      .post(`http://localhost:8080/api/eregusers`, { loginName: loginName })
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          setDataSource([res.data]);
          setTotalElements([res.data].length);
        }
        if (res.status == 400) {
          setDataSource([res.data]);
          setTotalElements([res.data].length);
        }
        // setTotalElements(res.data.totalElements);
        // setPage(res.data.page);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  };

  const updateRecords = (editingRegUser) => {
    axios
      .put(`http://localhost:8080/api/eregusers/${editingRegUser.loginName}`, {
        status: editingRegUser.status,
        mobileStatus: editingRegUser.mobileStatus,
        hashedPassword: editingRegUser.hashedPassword,
      })
      .then((res) => {
        fetchRecords(currentPage);
        message.success("Yenilendi");
        resetEditing();
        // setDataSource(res.data.content);
        // setTotalElements(res.data.totalElements);
        // setPage(res.data.page);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  };

  const editRegUser = (record) => {
    setIsModal(true);
    setEditingRegUser({ ...record });
  };

  const resetEditing = () => {
    setIsModal(false);
    setEditingRegUser(null);
    form.resetFields();
  };

  if (error) {
    return <div>Error !!!</div>;
  } else {
    return (
      <div>
        <div style={{ paddingBottom: 8, float: "right" }}>
          <Space>
            <Input
              onChange={(e) =>
                setSearch(e.target.value ? e.target.value : null)
              }
            />
            <Button onClick={() => searchRecords(search)} type="primary">
              Axtar
            </Button>
            <Button onClick={() => fetchRecords()}>Temizle</Button>
          </Space>
        </div>
        <Table
          rowKey={(record) => record.loginName}
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 8,
            total: totalElements,
            onChange: (page) => {
              setCurrentPage(page - 1);
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
            form
              .validateFields()
              .then(() => {
                if (
                  password != null &&
                  passwordVerify != null &&
                  password == passwordVerify
                ) {
                  editingRegUser.hashedPassword = md5(password);
                }
                updateRecords(editingRegUser);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          okText="Yadda saxla"
        >
          <Form form={form} labelCol={{ span: 6 }} autoComplete="off">
            <Form.Item label="Email təsdiq">
              <Switch
                onChange={(e) => {
                  setEditingRegUser((pre) => {
                    return { ...pre, status: e === true ? 9 : 1 };
                  });
                }}
                checked={editingRegUser?.status === 9 ? true : false}
              />
            </Form.Item>
            <Form.Item label="Telefon təsdiq">
              <Switch
                onChange={(e) => {
                  setEditingRegUser((pre) => {
                    return { ...pre, mobileStatus: e === true ? 9 : 1 };
                  });
                }}
                checked={editingRegUser?.mobileStatus === 9 ? true : false}
              />
            </Form.Item>
            <Form.Item
              name="password"
              hasFeedback
              label="Şifrə"
              rules={[{ whitespace: true }, { min: 3 }]}
            >
              <Input.Password
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="passwordVerify"
              dependencies={["password"]}
              label="Şifrənin təkrarı"
              hasFeedback
              rules={[
                { whitespace: true },
                { min: 3 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                value={passwordVerify}
                onChange={(e) => {
                  setPasswordVerify(e.target.value);
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
};

export default RegUsers;
