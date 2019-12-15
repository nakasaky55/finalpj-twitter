import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { Image, Row, Col, Button, Spinner } from "react-bootstrap";

import PostDetail from "../posts/postDetail";

export default function Profile(props) {
  const param = useParams();
  const [currentUser, setCurrentUser] = useState(null);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [controlClick, setControlClick] = useState(false);

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
      setFollowersList(data.followers)
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
      setFollowersList(data.followers)
      setControlClick(false);
    }
  };

  useEffect(() => {
    getCurrentuser();
  }, []);
  return currentUser ? (
    <>
      {/* <h1>{followersList.indexOf(props.userid) == true ? "dance" : "sleep"}</h1> */}
      <Row stle={{ backgroundColor: "blue" }}>
        <Col
          lg={4}
          md={3}
          sm={12}
          style={{ backgroundColor: "red" }}
          className="d-flex justify-content-center"
        >
          <Image
            // className="image-post-detail"
            style={{ width: "100%" }}
            src="https://www.premierchoicegroup.com/wp-content/uploads/place-holder-avatar.jpg"
            roundedCircle
          />
        </Col>
        <Col className="profile-right">
          <h1 className="profile-username">{currentUser.username}</h1>
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
                <button className="btn-follow" onClick={unfollow}>Following</button>
              ) : (
                <button className="btn-follow" onClick={follow}>
                  Follow
                </button>
              )
            ) : (
              <button className="btn-follow">Edit</button>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        {currentUser &&
          currentUser.posts.map(post => {
            return <PostDetail post={post} />;
          })}
      </Row>
    </>
  ) : (
    <h1>Loading</h1>
  );
}
