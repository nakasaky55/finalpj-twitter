import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { Image, Row, Col } from "react-bootstrap";

import PostDetail from "../posts/postDetail";

export default function Profile(props) {
  const param = useParams();
  const [currentUser, setCurrentUser] = useState(null);

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
    }
  };
  useEffect(() => {
    getCurrentuser();
  }, []);
  return currentUser ? (
    <>
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
                  {currentUser.following.length}
                </span>{" "}
                Following
              </p>
              <p>
                <span className="font-weight-bold">
                  {" "}
                  {currentUser.followers.length}{" "}
                </span>{" "}
                Followers
              </p>
            </div>
            {param.id != props.userid ? (
              <button className="btn-follow">Follow</button>
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
