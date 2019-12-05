import React, { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import Login from "../ultilities/login-page";
import Signup from "../ultilities/sign-up";
import ForgotPassword from "../ultilities/forgot";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import NewPassword from "../ultilities/newpassword";

export default function Landing(props) {
  const history = useHistory();
  const location = useLocation();
  console.log("asdasdasd", history);
  const goSignup = () => {
    history.push("/landing/" + "sign-up");
  };

  //Toast login
  const [showA, setShowA] = useState("none");

  const toggleShowA = val => {
    setShowA(val);
  };

  console.log("showA", showA);
  // Login response
  // const handleSubmitLogin = async event => {
  //   event.preventDefault();
  //   const inputData = {
  //     email: event.target.email.value,
  //     password: event.target.password.value
  //   };

  //   const resp = await fetch("https://127.0.0.1:5000/user/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: "Token abc"
  //     },
  //     body: JSON.stringify(inputData)
  //   });
  //   const data = await resp.json();

  //   console.log("data returns from api", data);
  // };
  return (
    <>
      <Container className="landing" fluid="true">
        <Row>
          <Col
            className="left-landing d-flex justify-content-center align-items-center"
            xs={6}
            md={6}
            sm={12}
          >
            <svg
              className="twitterIcon-bird"
              viewBox="0 0 1208 982"
              version="1.1"
            >
              <title>bird</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Final-Horizon"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="Artboard"
                  transform="translate(-286.000000, -117.000000)"
                  fillRule="nonzero"
                  fill="#1B95E0"
                >
                  <path
                    d="M1493.75308,233.195911 C1449.31783,252.922544 1401.56126,266.207828 1351.43951,272.19627 C1402.61804,241.549536 1441.92034,192.987798 1460.3889,135.116296 C1412.53168,163.498493 1359.49119,184.130942 1303.02874,195.252335 C1257.88897,147.093181 1193.42514,117 1122.16771,117 C962.190754,117 844.636121,266.258151 880.768067,421.202806 C674.896491,410.886582 492.324484,312.253414 370.089808,162.341063 C305.17308,273.705962 336.423691,419.391176 446.731805,493.16476 C406.171431,491.856361 367.925917,480.734968 334.561738,462.165765 C331.844294,576.95263 414.122472,684.342008 533.287442,708.245454 C498.413572,717.706186 460.218381,719.9204 421.368991,712.47259 C452.871217,810.904465 544.358512,882.514158 652.854997,884.52708 C548.686294,966.201382 417.443793,1002.68559 286,987.186091 C395.653915,1057.48739 525.940278,1098.50067 665.838342,1098.50067 C1125.89162,1098.50067 1385.81015,709.956437 1370.10936,361.469352 C1418.52012,326.494836 1460.53987,282.864756 1493.75308,233.195911 Z"
                    id="bird"
                  ></path>
                </g>
              </g>
            </svg>
            <ul className="landing-list">
              <li className="landing-list-item">
                <i className="fas fa-search"></i> Follow your interests.
              </li>
              <li className="landing-list-item">
                <i className="fas fa-user-friends"></i> Hear what people are
                talking about.
              </li>
              <li className="landing-list-item">
                <i className="fas fa-comments"></i> Join the conversation.
              </li>
            </ul>
          </Col>
          <Col
            className="right-landing d-flex justify-content-center align-items-center"
            xs={6}
            md={6}
            sm={12}
          >
            <Switch>
              <Route
                exact
                path="/landing"
                render={() => (
                  <Login
                    setUser={props.setUser}
                    goSignup={goSignup}
                    showA={showA}
                    toggleShowA={toggleShowA}
                  />
                )}
              />
              <Route
                exact
                path="/landing/sign-up"
                render={() => <Signup toggleShowA={toggleShowA} />}
              />
              <Route
                exact
                path="/landing/forgot_password"
                render={() => <ForgotPassword toggleShowA={toggleShowA} />}
              />
              <Route
                exact
                path="/landing/new_password/:token"
                render={() => <NewPassword toggleShowA={toggleShowA} />}
              />
            </Switch>
          </Col>
        </Row>
      </Container>
    </>
  );
}
