import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Dashboard(props) {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const setUpUser = () => {
    if (token) return true;
    return false;
  };

  //query user
  const getUser = async () => {
    const url = await fetch("https://127.0.0.1:5000/user/get_user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ` + token
      }
    });

    const resp = await url.json();

    props.setUser({
      user: {
        username: resp.username,
        email: resp.email
      }
    });
  };
  const findToken = setUpUser();

  useEffect(() => {
    getUser();
  }, [findToken]);

  const history = useHistory();
  if (!findToken) {
    history.push("/landing");
  } else {
    console.log(props.user);
  }
  return (
    <div>
      Welcome <span>{props.user.user.username}</span>
    </div>
  );
}
