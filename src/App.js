import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Landing from "./components/view/landing";
import Dashboard from "./components/view/dashboard";

function App(props) {
  console.log("run app")
  const [user, setUser] = useState({
    user: "Anonymous"
  });
  // console.log(user);
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [loadUser, setLoadUser] = useState(false)
  const setUpUser = () => {
    if (sessionStorage.getItem("token")) return true;
    return false;
  };
  const findToken = setUpUser();
  //query user
  const getUser = async () => {
    setLoadUser(true)
    const url = await fetch(`${process.env.REACT_APP_PATH}/user/get_user`, {
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
    setLoadUser(false)
  };
  

  useEffect(() => {
    getUser();
  }, []);

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
            findToken={findToken}
            loadUser={loadUser}
            getUser={getUser}
          />
        )}
      />
    </Switch>
  );
}

export default App;
