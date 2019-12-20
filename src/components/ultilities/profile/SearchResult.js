import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "./ProfileCard";

export default function SearchResult() {
  const param = useParams();
  const [query, setQuery] = useState(null);
  const [list, setList] = useState([]);
  const searchUser = async () => {
    console.log("run serach")
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/search/${query}`,
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
    console.log("run 2");
    searchUser();
  }, [query]);

  useEffect(() => {
    console.log("run 1");
    setQuery(param.input);
  }, [param]);

  if (list.length == 0) return <h1>No result matches</h1>;
  return list.map(item => {
    return <ProfileCard user={item} />;
  });
}
