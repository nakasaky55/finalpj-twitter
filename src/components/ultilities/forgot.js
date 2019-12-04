import React from "react";
import { Col, Form } from "react-bootstrap";
import {useHistory} from 'react-router-dom'

export default function Forgot(props) {
  const history = useHistory()
  const handleSubmit = async event => {
    event.preventDefault();
    const inputData = {
      email: event.target.email.value
    };
    const url = await fetch("https://127.0.0.1:5000/user/forgot_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(inputData)
    });

    const resp = await url.json();

    if(resp.message === "Success"){
      props.toggleShowA();
      history.push("/")
    }
  };
  return (
    <Col className="right-landing d-flex justify-content-center align-items-center">
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
    </Col>
  );
}
