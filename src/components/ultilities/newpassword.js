import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";

export default function NewPassword(props) {
  //Toast login
  // const [showMessage, setshowMessage] = useState("none");
  const [tokenValid, setTokenValid] = useState(true);
const history = useHistory();
  const param = useParams();

  const checkTokenValid = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/user/new_password/` + param.token,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );
    const data = await resp.json();
    if (data.message === "invalid") setTokenValid(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const inputData = {
      confirm: event.target.confirm.value,
      password: event.target.password.value
    };

    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/user/new_password/` + param.token,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(inputData)
      }
    );
    const data = await resp.json();

    if (data.message === "Success") {
      props.toggleShowA();
      history.push("/")
    }
  };

  useEffect(() => {
    checkTokenValid();
  }, []);

  return (
    <>
      {tokenValid ? (
        <div className="landing-login">
          <h1>Enter your new password</h1>
          <Form onSubmit={e => handleSubmit(e)}>
            <p>
              <i className="fab fa-twitter"></i>
            </p>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Enter your new password"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control
                name="confirm"
                type="password"
                placeholder="Enter your new password again"
              />
            </Form.Group>
            <button type="submit" className="btn-signin">
              Submit
            </button>
          </Form>
        </div>
      ) : (
        <h1>Token invalid</h1>
      )}
    </>
  );
}
