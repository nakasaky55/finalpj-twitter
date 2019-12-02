import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import Landing from "./components/view/landing";
import Dashboard from "./components/view/dashboard";

function App(props) {
  const [user, setUser] = useState({
    user: "Anonymous"
  });

  return (
    <Switch>
      <Route
        path="/landing"
        render={() => <Landing {...props} setUser={setUser} />}
      />
      <Route
        path="/"
        render={() => <Dashboard {...props} user={user} setUser={setUser} />}
      />
    </Switch>
  );
}

export default App;
