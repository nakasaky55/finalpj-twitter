import React, { useState } from "react";
import { Form, Toast } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { TextField, Button as MaterialButton } from "@material-ui/core";
import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import { amber, green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core/styles";

export default function Login(props) {
  const useStyles2 = makeStyles(theme => ({
    margin: {
      margin: theme.spacing(1)
    }
  }));
  const classes = useStyles2();
  const [open, setOpen] = useState("none");
  const [variantCustom, setVariant] = useState("info");
  const [messageCustom, setMessageCustom] = useState("");
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
    }else {
      setVariant("error");
      setMessageCustom(data.message);
      setOpen("flex")
    }
  };

  const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
  };

  const useStyles1 = makeStyles(theme => ({
    success: {
      backgroundColor: green[600]
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    info: {
      backgroundColor: theme.palette.primary.main
    },
    warning: {
      backgroundColor: amber[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1)
    },
    message: {
      display: "flex",
      alignItems: "center"
    }
  }));

  function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
      <SnackbarContent
        style={{ display: open }}
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar">
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {messageCustom}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={() => setOpen("none")}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>
        ]}
      />
    );
  }
  return (
    <>
      <style type="text/css">
        {`
        .btn-signup {
          border: none;
          color: blue;
          background-color: white;
        }

        .btn-signup:hover{
          text-decoration: underline;
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
          <form
            onSubmit={e => {
              console.log("submit");
              handleSubmit(e);
            }}
            noValidate
            autoComplete="off"
          >
            <MySnackbarContentWrapper
              variant={variantCustom}
              // className={classes.margin}
              message="This is a warning message!"
            />
            <br></br>
            <TextField
              required
              id="standard-email"
              type="email"
              name="email"
              label="Email"
              className="input-standard"
            />

            <TextField
              required
              id="standard-password"
              type="password"
              name="password"
              label="Password"
              className="input-standard"
            />

            <MaterialButton
              variant="contained"
              type="submit"
              style={{
                marginTop: "10px",
                backgroundColor: "#1da1f2",
                color: "white",
                margin:"10px 0"
              }}
            >
              Sign in
            </MaterialButton>
          </form>
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
