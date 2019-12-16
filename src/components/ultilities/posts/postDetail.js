import React, { useEffect, useState } from "react";
import {
  Col,
  Image,
  Spinner,
  Dropdown,
  DropdownButton,
  Button
} from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";

export default function PostDetail(props) {
  const history = useHistory();

  const [likeState, setLikeState] = useState(true);
  const [progress, setProgress] = useState(false);
  const [likeNumb, setLikeNumb] = useState(props.post.likes.length);
  const [commentsNumb, setCommentsNumb] = useState(props.post.comments.length);
  console.log(props);
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
          return `<a href="#">${word}</a>`;
        }
        return word;
      })
      .join(" ");
    return { __html: `${contentFormatted}` };
  };
  const likeToggle = async () => {
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

  const unLikeToggle = async () => {
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
    <Col sm={12} className="post-detail d-flex flex-column">
      <div
        className="d-flex justify-content-between postdetail-head"
        onClick={() => history.push(`/post/${props.post.id}`)}
      >
        <div className="d-flex">
          <div>
            <Image
              className="image-post-detail"
              src="https://www.premierchoicegroup.com/wp-content/uploads/place-holder-avatar.jpg"
              roundedCircle
            />
          </div>
          <div className="post-detail-content">
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
            <p dangerouslySetInnerHTML={contentFormat()}></p>
          </div>
        </div>
        <div>
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
        </div>
      </div>
      <div className="d-flex justify-content-around">
        {progress ? (
          <Spinner animation="border" variant="danger" />
        ) : likeState ? (
          <button className="btn-function" onClick={() => likeToggle()}>
            <i className="far fa-heart"></i> {likeNumb}
          </button>
        ) : (
          <button
            className="btn-function"
            style={{ color: "red" }}
            onClick={() => unLikeToggle()}
          >
            <i className="fas fa-heart"></i> {likeNumb}
          </button>
        )}

        <button className="btn-function">
          <i className="fas fa-retweet"></i>
        </button>
        <button
          className="btn-function"
          onClick={() => {
            props.handleShow();
            props.setPostDetail(props.post.id);
          }}
        >
          <i className="far fa-comment"></i> {commentsNumb}
        </button>
      </div>
    </Col>
  );
}
