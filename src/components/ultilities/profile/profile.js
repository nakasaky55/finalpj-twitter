import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { Row, Col, Button, Spinner, Accordion, Card } from "react-bootstrap";
import {
  Image,
  Video,
  Transformation,
  CloudinaryContext
} from "cloudinary-react";

import PostDetail from "../posts/postDetail";
import { Facebook } from "react-content-loader";

export default function Profile(props) {
  const param = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [avaUrl, setAvaUrl] = useState("download_qc5n9t");
  const [fileName, setFileName] = useState("");
  const [fileEncoded, setFileEncoded] = useState("");

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [controlClick, setControlClick] = useState(false);

  const [loadingUpload, SetLoadingUpload] = useState(false);

  const getCurrentuser = async () => {
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/get_user/${param.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data = await url.json();
    if (data.message == "success") {
      setCurrentUser(data);
      data.ava_url && setAvaUrl(data.ava_url);
      setFollowersList(data.followers);
    }
  };

  const follow = async () => {
    setControlClick(true);
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/follow/${param.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data = await url.json();
    if (data.message === "success") {
      setFollowersList(data.followers);
      setControlClick(false);
    }
  };

  const unfollow = async () => {
    setControlClick(true);
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/unfollow/${param.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data = await url.json();
    if (data.message === "success") {
      setFollowersList(data.followers);
      setControlClick(false);
    }
  };

  const encoded = file => {
    const conv = new FileReader();
    conv.onload = fileLoadedEvent => {
      var srcData = fileLoadedEvent.target.result;
      var newImage = document.createElement("img");
      newImage.src = srcData;
      document.getElementById("dummy").innerHTML = newImage.outerHTML;
      console.log(
        document.getElementById("dummy").getElementsByTagName("img")[0].src
      );
      // document.getElementById("txt").value = document.getElementById(
      //   "dummy"
      // ).innerHTML;
      return setFileEncoded(
        document.getElementById("dummy").getElementsByTagName("img")[0].src
      );
    };
    conv.readAsDataURL(file);
  };

  const editInfor = async e => {
    e.preventDefault();
    SetLoadingUpload(true);
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/${currentUser.user_id}/upload_ava`,
      {
        method: "POST",
        body: JSON.stringify({
          file: fileEncoded
        }),
        headers: {
          "Content-Type": "application/json",
          // Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const resp = await url.json();
    if (resp.response == "success") {
      SetLoadingUpload(false);
      setAvaUrl(resp.data);
      e.target.files = []
    }
  };

  useEffect(() => {
    getCurrentuser();
    document.title = "Profile";
  }, []);
  return currentUser ? (
    <>
      {/* <h1>{followersList.indexOf(props.userid) == true ? "dance" : "sleep"}</h1> */}
      <Row stle={{ backgroundColor: "blue" }}>
        <Col
          lg={4}
          md={3}
          sm={12}
          style={{
            backgroundColor: "red",
            maxWidth: "100%",
            maxHeight: "100%"
          }}
          className="d-flex justify-content-center"
        >
          {/* <Image
            // className="image-post-detail"
            style={{ width: "100%" }}
            src="https://www.premierchoicegroup.com/wp-content/uploads/place-holder-avatar.jpg"
            roundedCircle
          /> */}

          <Image
            cloudName="hslqp9lo2"
            publicId={avaUrl}
            responsive
            style={{ width: "100%" }}
          >
            <Transformation gravity="face" crop="scale" />
          </Image>
        </Col>
        <Col className="profile-right">
          <h1 className="profile-username">
            {currentUser.username}{" "}
            {!loadingUpload ? "" : <Spinner animation="grow" />}
          </h1>

          <div className="profile-detail">
            <p className="font-weight-light">
              <i class="far fa-calendar-alt"></i> Joined at{" "}
              {moment(currentUser.created_at).format("MMMM,Do")}
            </p>
            <div className="d-flex justify-content-start profile-number">
              <p>
                <span className="font-weight-bold">
                  {currentUser.followings.length}
                </span>{" "}
                Following
              </p>
              <p>
                <span className="font-weight-bold">
                  {" "}
                  {followersList.length}{" "}
                </span>{" "}
                Followers
              </p>
            </div>
            {currentUser.user_id == props.userid ? (
              <Accordion>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Click me!
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <form onSubmit={e => editInfor(e)}>
                      <input
                        type="file"
                        name="avatar"
                        onChange={e => {
                          encoded(e.target.files[0]);
                        }}
                      ></input>
                      <button className="btn-follow" type="submit">
                        Submit
                      </button>
                    </form>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            ) : (
              ""
            )}
            {param.id != props.userid ? (
              controlClick ? (
                <button className="btn-follow">
                  <Spinner
                    // as="span"
                    animation="grow"
                    // size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </button>
              ) : followersList.indexOf(props.userid) !== -1 ? (
                <button className="btn-follow" onClick={unfollow}>
                  Following
                </button>
              ) : (
                <button className="btn-follow" onClick={follow}>
                  Follow
                </button>
              )
            ) : (
              // <button className="btn-follow">Edit</button>
              ""
            )}
          </div>
        </Col>
      </Row>
      <Row>
        {currentUser &&
          currentUser.posts.map(post => {
            return (
              <PostDetail
                post={post}
                getCurrentuser={getCurrentuser}
                avaUrl={avaUrl}
              />
            );
          })}
      </Row>
      <div id="dummy" style={{ display: "none" }}></div>
      <div id="txt" style={{ display: "none" }}></div>
    </>
  ) : (
    <Facebook />
  );
}
