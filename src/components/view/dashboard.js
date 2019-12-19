import React, { useEffect } from "react";
import { useHistory, Switch, Route, Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import MainContent from "../ultilities/main-content";
import CurrentPost from "../ultilities/posts/currentPost";
import { Facebook } from "react-content-loader";
import { CSSTransition } from "react-transition-group";
import Profile from "../ultilities/profile/profile";
import Trending from "../ultilities/trending";
import Explore from "../ultilities/posts/explore";
import TagClick from "../ultilities/clickTrending/TagClick";
import SearchResult from "../ultilities/profile/SearchResult"

export default function Dashboard(props) {
  function mapStyles(styles) {
    return {
      opacity: styles.opacity,
      transform: `scale(${styles.scale})`
    };
  }

  // wrap the `spring` helper to use a bouncy config
  const bounceTransition = {
    // start in a transparent, upscaled state
    atEnter: {
      opacity: 0
    },
    // leave in a transparent, downscaled state
    atLeave: {
      opacity: 0
    },
    // and rest at an opaque, normally-scaled state
    atActive: {
      opacity: 1
    }
  };

  const override = `
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  const history = useHistory();
  if (!sessionStorage.getItem("token")) {
    history.push("/landing");
  } else {
    // console.log(props.user);
  }

  const doLogout = async () => {
    console.log(`${process.env.REACT_APP_PATH}/user/logout`);
    const url = await fetch(`${process.env.REACT_APP_PATH}/user/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ` + sessionStorage.getItem("token")
      }
    });

    const resp = await url.json();
    if (resp.message === "success") {
      sessionStorage.removeItem("token");
      props.setUser({ user: "Anonymous" });
      history.push("/landing");
    } else console.log("fail");
  };

  useEffect(() => {
    props.getUser();
    document.title = "Dashboard";
  }, []);
  return (
    <>
      <style type="text/css">
        {`

    @media only screen and (max-width: 991px) {
      
      .sidebar_nav_text{
        display:none;
        
      }
      .fa-feather {
        display: block
      }

      .sidebar_nav_items >p {
        margin-right: 0px;
      }
    }

    

    @media only screen and (max-width:1199px) {
      .sidebar_nav_items {
        padding-left:0 !important;
      }
    }

    

    .dashboard_logo{
      width:47px;
      height: 47px;
    }

    .sidebar-sm{
      display:none;
    }

    .custom-nav{
      display:flex;
      justify-content: center;
      flex-direction:column;
      align-items: center;
    }

    .sidebar_nav_icon {
      font-size:16px;
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
      padding-top: 10px;
      border-right: 1px solid #0000003b
    }
    .sidebar_nav_text {
      min-width:50%;
      padding-left:10px;
      font-weight: 300;
    }
    
    .sidebar_nav_items{
      width:100%;
      line-height:50px;
      display:flex;
      justify-content: flex-start;
      margin-bottom: 35px;
      font-weight: 300;
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
      color: #1da1f2;
      text-decoration: none;
      border-radius:10px;
      transition: 0.3s ease;
    }
    
    
    .content {
      background-color: white;
      min-height: 110vh;
      padding:0;
    }
    .trending {
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
      max-width:80%
    }
    .logout-btn {
      background-color: #C84630;
      max-width:80%;
      display: flex;
      flex-wrap: inherit;
      padding: 05px;
    }
    .svg-twitter {
      width: 45px;
      height: 45px;
      border-radius: 30px;
      padding: 7px;
      transition: 0.5s ease;
      cursor: pointer;
    }
    .svg-twitter:hover {
      background-color:#c5e8db;
      transition: 0.5s ease;
    }
    `}
      </style>
      <Container className="contains">
        <div className="sidebar-sm sticky-top">
          <div className="d-flex" style={{ height: "100%" }}>
            <div className="sidebar-sm-item">
              <Link to="/">
                <i className="far fa-newspaper sidebar-sm-icon"></i>
              </Link>
            </div>
            <div className="sidebar-sm-item sidebar-sm-icon">
              <i className="far fa-newspaper"></i>
            </div>
            <div className="sidebar-sm-item sidebar-sm-icon">
              <i className="far fa-newspaper"></i>
            </div>
            <div className="sidebar-sm-item sidebar-sm-icon">
              <i className="far fa-newspaper"></i>
            </div>
          </div>
        </div>
        <Row>
          <Col lg={2} md={2} sm={2} xs={2} className="sb-child sidebar">
            <nav className="custom-nav">
              <div className="sidebar_nav_items">
                <svg
                  viewBox="0 0 24 24"

                  className="svg-twitter"
                  onClick={() => history.push("/")}
                >
                  <g>
                    <path
                      d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
                      style={{ fill: "#1da1f2" }}
                    ></path>
                  </g>
                </svg>
              </div>
              <Link to="/" className="sidebar_nav_items">
                <div className="sidebar_nav_icon">
                  <i className="far fa-newspaper"></i>
                </div>
                <div className="sidebar_nav_text">
                  <Link to="/">
                    <span>Dashboard</span>
                  </Link>
                </div>
              </Link>
              <Link to="/explore" className="sidebar_nav_items">
                <div className="sidebar_nav_icon">
                  <i className="fab fa-slack-hash"></i>
                </div>
                <div className="sidebar_nav_text">
                  <Link to="/explore">
                    <span>Explore</span>
                  </Link>
                </div>
              </Link>
              <a href="#" className="sidebar_nav_items">
                <div className="sidebar_nav_icon">
                  <i className="far fa-bell"></i>
                </div>
                <div className="sidebar_nav_text">
                  <span>Notifications</span>
                </div>
              </a>
              <Link
                to={`/user/${props.user.user.id}`}
                className="sidebar_nav_items"
              >
                <div className="sidebar_nav_icon">
                  <i className="far fa-user-circle"></i>
                </div>

                <Link to={`/user/${props.user.user.id}`}>
                  <div className="sidebar_nav_text">
                    <span>Profile</span>
                  </div>
                </Link>
              </Link>

              <div className="sidebar_nav_items">
                <Button className="btn-custom tweet-btn ">
                  <i className="fas fa-feather"></i>
                  <span className="sidebar_nav_text tweet-text">Tweet</span>
                </Button>
              </div>
              <div className="sidebar_nav_items">
                <Button
                  className="btn-custom logout-btn"
                  onClick={() => doLogout()}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="sidebar_nav_text logout-text">Logout</span>
                </Button>
              </div>
            </nav>
          </Col>
          <Col lg={7} md={10} sm={10} xs={10} className="sb-child content">
            <Switch>
              <Route
                exact
                path="/post/:id"
                render={() => <CurrentPost user={props.user} />}
              />
              <Route
              exact
              path="/search/:input"
              render={() => <SearchResult />}

              />
              <Route
                exact
                path="/user/:id"
                render={() => <Profile userid={props.user.user.id} />}
              />
              <Route
                exact
                path="/trending/:pathParam?"
                render={() => <TagClick />}
              />
              <Route exact path="/explore" render={() => <Explore />} />
              <Route
                path="/"
                render={() => (
                  <MainContent
                    findToken={props.findToken}
                    user={props.user}
                    loadUser={props.loadUser}
                    avaUrl={props.user.user.ava_url}
                  />
                )}
              />
            </Switch>
          </Col>
          <Col className="sb-child trending d-none d-lg-block border-left">
            <Trending />
          </Col>
        </Row>
      </Container>
    </>
  );
}
