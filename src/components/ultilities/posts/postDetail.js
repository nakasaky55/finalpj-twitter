import React, { useEffect, useState } from "react";
import { Col, Image, Spinner, Modal } from "react-bootstrap";
import moment from "moment";

export default function PostDetail(props) {
  const [likeState, setLikeState] = useState(true);
  const [progress, setProgress] = useState(false);

  const checkLike = () => {
    if (props.post.likes.indexOf(props.user.user.id)) {
      setLikeState(true);
    } else {
      setLikeState(false);
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
    }
  };

  useEffect(() => {
    contentFormat();
    checkLike();
  }, []);
  return (
    <Col sm={12} className="post-detail d-flex">
      <div>
        <Image
          className="image-post-detail"
          src="https://www.premierchoicegroup.com/wp-content/uploads/place-holder-avatar.jpg"
          roundedCircle
        />
      </div>
      <div className="post-detail-content">
        <b>{props.post.author}</b>
        <small className="text-muted">
          {" "}
          {moment(props.post.created_at).fromNow()}
        </small>
        <p dangerouslySetInnerHTML={contentFormat()}></p>
        <div className="d-flex justify-content-around">
          {progress ? (
            <Spinner animation="border" variant="danger" />
          ) : likeState ? (
            <button className="btn-function" onClick={() => likeToggle()}>
              <i class="far fa-heart"></i>
            </button>
          ) : (
            <button
              className="btn-function"
              style={{ color: "red" }}
              onClick={() => unLikeToggle()}
            >
              <i class="fas fa-heart"></i>
            </button>
          )}

          <button className="btn-function">
            <i class="fas fa-retweet"></i>
          </button>
          <button className="btn-function" onClick={props.handleShow}>
            <i class="far fa-comment"></i>
          </button>
        </div>
      </div>

      
    </Col>
  );
}
