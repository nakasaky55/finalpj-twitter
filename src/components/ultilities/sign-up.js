import React from "react";
import { Col, Form, Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Signup(props) {
  const history = useHistory();
  const goLanding = () => {
    props.toggleShowA();
    history.push("/landing");
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const inputData = {
      email: event.target.email.value,
      username: event.target.username.value,
      password: event.target.password.value,
      address: "testing"
    };

    const resp = await fetch("https://127.0.0.1:5000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(inputData)
    });
    const data = await resp.json();

    if (data.state == "success") {
      goLanding();
    }
  };
  return (
    <Col className="right-landing d-flex justify-content-center align-items-center">
      <div className="landing-login">
        <Form onSubmit={e => handleSubmit(e)}>
          <p>
            <i className="fab fa-twitter"></i>
          </p>
          <h1>See what’s happening in the world right now</h1>
          <hr></hr>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control name="email" type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Display name</Form.Label>
            <Form.Control
              name="username"
              type="text"
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              name="confirm"
              type="password"
              placeholder="Confirm your password"
            />
          </Form.Group>
          <button type="submit" className="btn-signin">
            Sign up
          </button>
        </Form>
      </div>
    </Col>
  );
}
