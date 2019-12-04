import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

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
    console.log("runnn effect ")
  }, [findToken === true]);

  const history = useHistory();
  if (!findToken) {
    console.log("check run")
    history.push("/landing");
  } else {
    console.log(props.user);
  }

  const doLogout = async () => {
    const url = await fetch('https://127.0.0.1:5000/user/logout',
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ` + token
      }
    })

    const resp = await url.json()
    if( resp.message == "success"){
      sessionStorage.removeItem('token');
      history.push("/landing")
    } else console.log("fail")
  }
  return (
    <>
      <style type="text/css">
        {`
    @media only screen and (max-width: 991px) {
      
      .sidebar_nav_text{
        display:none
      }
      .fa-feather {
        display: block
      }

      .sidebar_nav_items >p {
        margin-right: 0px;
      }
    }
    .dashboard_logo{
      width:47px;
      height: 47px;
    }

    .contains {
      background-color: black;
    }
    .sb-child {
      min-height: 100vh;
      font-size: 19px;
      font-weight: bold
    }

    .sidebar {
      background-color: white;
      height: 100vh;
      position:sticky;
      top:0;
      padding-top: 10px
    }
    .sidebar_nav_text {
      min-width:50%;
      padding-left:10px
    }
    
    .sidebar_nav_items{
      min-width: 60%;
      height:50px;
      line-height:50px;
      display:flex;
      justify-content: center;
      margin-bottom: 15px;
      transition: 0.3s ease;
    }
    .sidebar_nav_items button {
      height: 50px;
      text-align:center;
      font-size: 20px;
      font-weight: bold;
      width: 100%
    }
    .sidebar a {
      color: black
    }

    .sidebar a:hover {
      background-color:#1da1f2;
      color: white;
      text-decoration: none;
      border-radius:10px;
      transition: 0.3s ease;
    }
    
    
    .content {
      background-color: purple;
      height: 110vh;
    }
    .trending {
      background-color: orange;
      height: 100vh;
      position:sticky;
      top:0
    }
    .btn-custom {
      border-radius: 15px;
      color: white;
      border:none;
    }
    .tweet-btn {
      background-color:#1da1f2;
    }
    .logout-btn {
      background-color: #C84630;
    }
    `}
      </style>
      <Container fluid="true" className="contains">
        <Row>
          <Col lg={2} md={2} sm={12} className="sb-child sidebar">
            <nav className="d-flex flex-column justify-content-center align-items-center">
              <div className="sidebar_nav_items">
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: "47px", height: "47px" }}
                >
                  <g>
                    <path
                      d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
                      style={{ fill: "#1da1f2" }}
                    ></path>
                  </g>
                </svg>
              </div>
              <a href="#" className="sidebar_nav_items">
                <div className="sidebar_nav_icon">
                  <i class="far fa-newspaper"></i>
                </div>
                <div className="sidebar_nav_text">
                  <span>Dashboard</span>
                </div>
              </a>
              <a href="#" className="sidebar_nav_items">
                <div className="sidebar_nav_icon">
                  <i class="fab fa-slack-hash"></i>
                </div>
                <div className="sidebar_nav_text">
                  <span>Trending</span>
                </div>
              </a>
              <a href="#" className="sidebar_nav_items">
                <div className="sidebar_nav_icon">
                  <i class="far fa-bell"></i>
                </div>
                <div className="sidebar_nav_text">
                  <span>Notifications</span>
                </div>
              </a>
              <a href="#" className="sidebar_nav_items">
                <div className="sidebar_nav_icon">
                  <i class="far fa-user-circle"></i>
                </div>
                <div className="sidebar_nav_text">
                  <span>Profile</span>
                </div>
              </a>

              <div className="sidebar_nav_items">
                <Button className="btn-custom tweet-btn ">
                  <i className="fas fa-feather"></i>
                  <span className="sidebar_nav_text">Tweet</span>
                </Button>
              </div>
              <div className="sidebar_nav_items">
                <Button className="btn-custom logout-btn " onClick={() => doLogout()}>
                  <i class="fas fa-sign-out-alt"></i>
                  <span className="sidebar_nav_text">Logout</span>
                </Button>
              </div>
            </nav>
          </Col>
          <Col lg={7} md={10} sm={12} className="sb-child content text-white">
            Welcome {props.user.user.username}!
          </Col>
          <Col className="sb-child trending d-none d-lg-block">Trending</Col>
        </Row>
      </Container>
    </>
  );
}
