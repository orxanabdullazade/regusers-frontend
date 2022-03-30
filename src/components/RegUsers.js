import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import axios from "axios";
import { Table, Tag, Space } from "antd";

const RegUsers = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [regUserList, setRegUserList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/eregusers/")
      .then((response) => {
        console.log(response);
        setIsLoaded(true);
        setRegUserList(response.data.content);
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, []);

  const dataSource = !isLoaded
    ? "wait"
    : regUserList.map((row) => ({
        loginName: row.loginName,
        status: row.status,
        mobileStatus: row.mobileStatus,
        edit: () => <a>Delete</a>,
      }));


  const columns = [
    {
      title: "Email",
      dataIndex: "loginName",
      key: "loginName",
    },
    {
      title: "Email təsdiq",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Telefon təsdiq",
      dataIndex: "mobileStatus",
      key: "mobileStatus",
    },
    {
      title: "#",
      dataIndex: "",
      key: "",
    },
  ];

  if (error) {
    return <div>Error !!!</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Table columns={columns} dataSource={dataSource} />
      //   <ul>
      //     {regUserList.map((regUser) => {

      //       return (<li>{regUser.loginName}</li>);
      //     })}
      //   </ul>
    );
  }
};

export default RegUsers;
