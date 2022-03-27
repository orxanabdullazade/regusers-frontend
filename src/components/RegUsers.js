import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import axios from "axios";
import { Table, Tag, Space } from 'antd';

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

  if (error) {
    return <div>Error !!!</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {regUserList.map((regUser) => {
            
          return (<li>{regUser.loginName}</li>);
        })}
      </ul>
    );
  }
};

export default RegUsers;
