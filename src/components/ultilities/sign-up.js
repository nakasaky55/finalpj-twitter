import React, { useEffect, useState } from "react";
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

export default function Signup(props) {
  const useStyles2 = makeStyles(theme => ({
    margin: {
      margin: theme.spacing(1)
    }
  }));
  const classes = useStyles2();
  const [open, setOpen] = useState("none");
  const [variantCustom, setVariant] = useState("info");
  const [messageCustom, setMessageCustom] = useState("");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const history = useHistory();
  const [showDuplicated, setDuplicated] = useState("none");
  const goLanding = () => {
    props.toggleShowA("block");
    history.push("/landing");
  };

  const toggleShowDuplicated = val => {
    setDuplicated(val);
  };

  const toggleCloseDuplicated = () => {
    setDuplicated("none");
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const inputData = {
      email: event.target.email.value,
      username: event.target.username.value,
      password: event.target.password.value,
      address: "testing"
    };

    if (
      inputData.email.trim() != "" &&
      inputData.username.trim() != "" &&
      inputData.password.trim() != ""
    ) {
      console.log("pass");
    } else {
      setMessageCustom("Please fill all the fields");
      setVariant("warning");
      setOpen("flex")
      return false;
    }

    const resp = await fetch(`${process.env.REACT_APP_PATH}/user/signup`, {
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
    } else if (data.state === "duplicate") {
      setMessageCustom("Email is taken");
      setVariant("info");
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

  useEffect(() => {
    props.toggleShowA("none");
    toggleShowDuplicated("none");
  }, []);
  return (
    <>
      <div className="landing-login">
        <p>
          <i className="fab fa-twitter"></i>
        </p>
        <h1>See what’s happening in the world right now</h1>
        <hr></hr>
        {/* <Toast
          show={showDuplicated=="none" ? false:true}
          onClose={toggleCloseDuplicated}
          style={{ display: showDuplicated }}
        >
          <Toast.Header className="bg-warning text-black">
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Email is taken</strong>
          </Toast.Header>
        </Toast> */}
        <form onSubmit={e => {
          console.log("submit")
          handleSubmit(e);
        }} noValidate autoComplete="off">
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
            id="standard-username"
            name="username"
            label="Username"
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
          <TextField
            required
            id="standard-confirm"
            type="password"
            name="confirm"
            label="Confirm"
            className="input-standard"
          />
          <MaterialButton
            variant="contained"
            type="submit"
            style={{
              marginTop: "10px",
              backgroundColor: "#1da1f2",
              color: "white"
            }}
          >
            Sign up
          </MaterialButton>
        </form>
        {/* <Form.Group controlId="formBasicEmail">
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
          </Form.Group> */}
      </div>
    </>
  );
}
