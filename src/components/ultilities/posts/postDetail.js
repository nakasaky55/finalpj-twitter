import React, { useEffect, useState } from "react";
import { Col, Image } from "react-bootstrap";

export default function PostDetail(props) {
  const checkLike = () => {
    if (props.post.likes.indexOf(props.user.user.id)) {
      return true;
    }
    return false;
  };

  const [likeState, setLikeState] = useState(checkLike());

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
    const url = await fetch(
      `https://127.0.0.1:5000/posts/like/${props.post.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + props.token
        }
      }
    );
    const data = await url.json();
    if (data.message === "like success") setLikeState(!likeState);
  };

  useEffect(() => {
    contentFormat();
    checkLike();
  }, [props.post]);
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
        <p dangerouslySetInnerHTML={contentFormat()}></p>
        <div className="d-flex justify-content-around">
          {likeState ? (
            <button className="btn-function" onClick={() => likeToggle()}>
              <i class="far fa-heart"></i>
            </button>
          ) : (
            <button className="btn-function" onClick={() => likeToggle()}>
              <i class="fas fa-heart"></i>
            </button>
          )}

          <button className="btn-function">
            <i class="fas fa-retweet"></i>
          </button>
          <button className="btn-function">
            <i class="far fa-comment"></i>
          </button>
        </div>
      </div>
    </Col>
  );
}
