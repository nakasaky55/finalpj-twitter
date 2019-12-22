import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import { Container } from "react-bootstrap";
import { List } from "react-content-loader";

export default function SearchResult() {
  const param = useParams();
  const [query, setQuery] = useState(null);
  const [dataState, setDataState] = useState(true);
  const [list, setList] = useState([]);
  const searchUser = async () => {
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
    }else {
      setDataState(false);
      setList([])
    }
  };
  useEffect(() => {
    searchUser();
  }, [query]);

  useEffect(() => {
    setQuery(param.input);
  }, [param]);

  if (list.length == 0 && dataState == false) return <h1>No result matched</h1>;
  if (list.length == 0) return <List className="loader-custom" />;
  return (
    <Container>
      {list.map(item => {
        return <ProfileCard user={item} />;
      })}
    </Container>
  );
}
