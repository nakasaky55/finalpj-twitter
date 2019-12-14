import React from "react";
import { Form, Toast } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Login(props) {
  // console.log("login prop", props)
  const history = useHistory();
  const goDashboard = () => {
    history.push("/");
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const inputData = {
      email: event.target.email.value,
      password: event.target.password.value
    };

    const resp = await fetch(`${process.env.REACT_APP_PATH}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(inputData)
    });
    const data = await resp.json();

    

    if (data.state) {
      sessionStorage.setItem("token", data.token);
      console.log("data returns from api", data.state);
      goDashboard();
    }
  };
  return (
    <>
      <style type="text/css">
        {`
        .btn-signup {
          border: none
        }
        `}
      </style>

      <div className="landing-login">
        <Form onSubmit={e => handleSubmit(e)}>
          <p>
            <i className="fab fa-twitter"></i>
          </p>
          <h1>See what’s happening in the world right now</h1>
          <hr></hr>

          <Toast
            show={props.showA}
            onClose={props.toggleShowA}
            style={{ display: props.showA }}
          >
            <Toast.Header className="bg-success text-white">
              <img
                src="holder.js/20x20?text=%20"
                className="rounded mr-2"
                alt=""
              />
              <strong className="mr-auto">Successfully sign up</strong>
            </Toast.Header>
            {/* <Toast.Body>You're successfully sign up.</Toast.Body> */}
          </Toast>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control name="email" type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <p>
              <button
                className="btn-signup"
                onClick={() => history.push("/landing/forgot_password")}
              >
                Forgot your password ?
              </button>
            </p>
          </Form.Group>
          <button type="submit" className="btn-signin">
            Sign in
          </button>
          <div>
            <p>
              Don't have an account ? Sign up here{" "}
              <button className="btn-signup" onClick={() => props.goSignup()}>
                Signup
              </button>
            </p>
          </div>
        </Form>
      </div>
    </>
  );
}
