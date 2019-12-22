import React, { useEffect, useState } from "react";
import { Col, Image, Spinner, Row, Dropdown } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { Image as ImageCloud, Transformation } from "cloudinary-react";
import Divider from "@material-ui/core/Divider";
import { Select, MenuItem } from "@material-ui/core";

export default function PostDetail(props) {
  const history = useHistory();

  const [likeState, setLikeState] = useState(true);
  const [progress, setProgress] = useState(false);
  const [likeNumb, setLikeNumb] = useState(props.post.likes.length);
  const [commentsNumb, setCommentsNumb] = useState(props.post.comments.length);
  const checkLike = () => {
    if (!props.post.like_state) {
      setLikeState(true);
      console.log("liked");
    } else {
      setLikeState(false);
      console.log("not like yet");
    }
  };
  const contentFormat = () => {
    const content = props.post.content.split(" ");
    const contentFormatted = content
      .map(word => {
        if (word.charAt(0) === "#") {
          return `<a href="/trending/${word.replace("#", "")}">${word}</a>`;
        }
        return word;
      })
      .join(" ");
    return { __html: `${contentFormatted}` };
  };
  const likeToggle = async e => {
    e.stopPropagation();
    setProgress(true);
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/posts/like/${props.post.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data = await url.json();
    if (data.message === "like success") {
      setLikeState(false);
      setProgress(false);
      setLikeNumb(data.length);
    }
  };

  const unLikeToggle = async e => {
    e.stopPropagation();
    setProgress(true);
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/posts/unlike/${props.post.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data = await url.json();
    if (data.message === "unlike success") {
      setLikeState(true);
      setProgress(false);
      setLikeNumb(data.length);
    }
  };

  const deleteThisPost = async () => {
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/posts/delete/${props.post.id}`,
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
    if (data.message == "success") {
      if (history.location.pathname.split("/")[1] == "user") {
        props.getCurrentuser();
      } else props.getPosts(1);
    }
  };

  useEffect(() => {
    contentFormat();
    checkLike();
  }, []);
  return (
    <>
      <Col lg={12} md={12} sm={12} xs={12} className="post-detail d-flex flex-column">
        <div onClick={() => history.push(`/post/${props.post.id}`)}>
          <Row>
            <Col lg={2} md={2} sm={2} xs={2} className="avatar-input">
              <ImageCloud
                style={{ margin: "0px" }}
                cloudName="hslqp9lo2"
                publicId={props.avaUrl ? props.avaUrl : ""}
                responsive
              >
                <Transformation
                  width="60"
                  height="60"
                  // gravity="face"
                  responsive
                  radius="max"
                  crop="thumb"
                />
              </ImageCloud>
            </Col>
            <Col className="post-detail-content">
              <div>
                <b
                  onClick={e => {
                    e.stopPropagation();
                    history.push(`/user/${props.post.author_id}`);
                  }}
                >
                  {props.post.author}
                </b>
                <small className="text-muted">
                  {" "}
                  {moment(props.post.created_at).format("MMM, Do")}
                </small>
                <p
                  className="font-weight-normal"
                  dangerouslySetInnerHTML={contentFormat()}
                ></p>
              </div>
              <div class="dropdown dropleft" onClick={e => e.stopPropagation()}>
                <a
                  class="btn-custom text-monospace"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="fas fa-chevron-down"></i>
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {props.userid == props.post.author_id ? (
                    <button
                      className="dropdown-item"
                      onClick={() => deleteThisPost()}
                    >
                      {" "}
                      <i className="fa fa-trash-alt"></i>{" "}
                      <span style={{ color: "red" }}>Delete</span>
                    </button>
                  ) : (
                    ""
                  )}

                  <a class="dropdown-item" href="#">
                    Another action
                  </a>
                  <a class="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              lg={{ span: 10, offset: 2 }}
              md={{ span: 10, offset: 2 }}
              sm={{ span: 10, offset: 2 }}
              xs={{ span: 10, offset: 2 }}
              className="d-flex justify-content-center image-post"
            >
              <ImageCloud
                cloudName="hslqp9lo2"
                publicId={props.content_img ? props.content_img : ""}
                responsive
                style={{ maxWidth: "100%" }}
              >
                <Transformation radius="25" crop="fill" />
              </ImageCloud>
            </Col>
            <Col
              lg={{ span: 10, offset: 2 }}
              md={{ span: 10, offset: 2 }}
              sm={{ span: 10, offset: 2 }}
              xs={{ span: 10, offset: 2 }}

              // style={{ maxWidth: "100%" }}
            >
              <div
                className="d-flex justify-content-around"
                style={{ margin: "10px 0px" }}
              >
                {progress ? (
                  <Spinner animation="border" variant="danger" />
                ) : likeState ? (
                  <button className="btn-function" onClick={e => likeToggle(e)}>
                    <i className="far fa-heart"></i> {likeNumb}
                  </button>
                ) : (
                  <button
                    className="btn-function"
                    style={{ color: "red" }}
                    onClick={e => unLikeToggle(e)}
                  >
                    <i className="fas fa-heart"></i> {likeNumb}
                  </button>
                )}

                <button className="btn-function">
                  <div class="dropdown dropleft">
                    <a
                      href="#"
                      role="button"
                      id="dropdownMenuLink"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      style={{color:"black"}}
                    >
                      <i
                        className="fas fa-retweet"
                        id="demo-simple-select-label"
                        onClick={e => e.stopPropagation()}
                      ></i>
                    </a>

                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <a class="dropdown-item" href="#">
                        Retweet
                      </a>
                      <a class="dropdown-item" href="#">
                        Retweet with comment
                      </a>
                    </div>
                  </div>
                </button>
                <button
                  className="btn-function"
                  onClick={e => {
                    e.stopPropagation();
                    props.handleShow();
                    props.setPostDetail(props.post.id);
                  }}
                >
                  <i className="far fa-comment"></i> {commentsNumb}
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
      <Divider style={{ width: "100%" }} />
    </>
  );
}
