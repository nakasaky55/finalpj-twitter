import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Landing from "./components/view/landing";
import Dashboard from "./components/view/dashboard";

function App(props) {
  const [user, setUser] = useState({
    user: "Anonymous"
  });
  console.log(user);
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
        Authorization: `Token ` + sessionStorage.getItem("token")
      }
    });

    const resp = await url.json();

    setUser({
      user: {
        username: resp.username,
        email: resp.email,
        id: resp.id
      }
    });
  };
  const findToken = setUpUser();

  useEffect(() => {
    getUser();
  }, [findToken === true]);


  return (
    <Switch>
      <Route
        path="/landing"
        render={() => <Landing {...props} setUser={setUser} />}
      />
      <Route
        path="/"
        render={() => (
          <Dashboard
            {...props}
            user={user}
            setUser={setUser}
            token={token}
            findToken={findToken}
            getUser={getUser}
          />
        )}
      />
    </Switch>
  );
}

export default App;
