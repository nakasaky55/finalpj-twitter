import React from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Forgot(props) {
  const history = useHistory();
  const handleSubmit = async event => {
    event.preventDefault();
    const inputData = {
      email: event.target.email.value
    };
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/forgot_password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(inputData)
      }
    );

    const resp = await url.json();

    if (resp.message === "Success") {
      props.toggleShowA();
      history.push("/");
    }
  };
  return (
    <>
      <div className="landing-login">
        <h1>Enter your email</h1>
        <Form onSubmit={e => handleSubmit(e)}>
          <p>
            <i className="fab fa-twitter"></i>
          </p>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter your email"
            />
          </Form.Group>
          <button type="submit" className="btn-signin">
            Submit
          </button>
        </Form>
      </div>
    </>
  );
}
