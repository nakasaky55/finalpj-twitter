import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "./ProfileCard";

export default function SearchResult() {
  const param = useParams();
  const [list, setList] = useState([]);

  const searchUser = async () => {
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/search/${param.input}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );

    const resp = await url.json();
    if (resp.state) {
      setList(resp.data);
    }
  };

  useEffect(() => {
    searchUser();
  }, []);

  if (list.length == 0) return <h1>No result matches</h1>;
  return list.map(item => {
    return <ProfileCard user={item}/>;
  });
}
