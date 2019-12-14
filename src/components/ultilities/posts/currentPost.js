import React, { useState, useEffect } from "react";
import { Col, Image, Spinner, Row, Modal, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Facebook } from "react-content-loader";

import Comment from "../posts/comment";

export default function CurrentPost(props) {
  const param = useParams();
  //control like or not and likes number
  const [likeState, setLikeState] = useState(null);
  const [likeNumb, setLikeNumb] = useState(null);
  //loading when click like
  const [progress, setProgress] = useState(false);
  const [commentsNumb, setCommentsNumb] = useState(0);
console.log("currpost", props)
  //control modal comment show/hide
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Get data from comment model
  const [comment, setComment] = useState(null);

  //store post get from api
  const [currPost, setCurrPost] = useState(null);
  const [currPostProgress, setCurrPostProgress] = useState(false);
  const [currPostComment, setCurrPostComment] = useState(null);
  const [currPostCommentProgress, setCurrPostCommentProgress] = useState(
    "init"
  );
  const checkLike = () => {
    if (currPost && currPost.state) {
      if (currPost.like_state) {
        setLikeState(true);
      } else setLikeState(false);
      setLikeNumb(currPost.likes.length);
      setCommentsNumb(currPost.comments.length);
      setCurrPostProgress(true);
    }
  };

  const contentFormat = data => {
    const content = data;
    const contentFormatted = content
      .split(" ")
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
      `${process.env.REACT_APP_PATH}/posts/like/${param.id}`,
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
      setLikeState(true);
      setProgress(false);
      setLikeNumb(data.length);
    }
  };

  const unLikeToggle = async () => {
    setProgress(true);
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/posts/unlike/${param.id}`,
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
      setLikeState(false);
      setProgress(false);
      setLikeNumb(data.length);
    }
  };

  const getCurrentPost = async () => {
    setCurrPostProgress(false);
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/posts/${param.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data = await resp.json();
    console.log(data);
    if (data.state) {
      setCurrPost(data);
      setCurrPostComment(data.comments);
    }
  };

  //post a comment
  const handleCommentSubmit = async e => {
    e.preventDefault();
    const inputData = {
      content: comment.trim()
    };
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/posts/${param.id}/create_comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(inputData)
      }
    );
    const data = await resp.json();
    if (data.message == "created") {
      handleClose();
      setCurrPostComment(data.comments);
    }
  };

  //reset cursor in contenteditable
  //Control cursor pointer
  function setEndOfContenteditable(contentEditableElement) {
    var range, selection;
    if (document.createRange) {
      //Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange(); //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection(); //get the selection object (allows you to change selection)
      selection.removeAllRanges(); //remove any selections already made
      selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) {
      //IE 8 and lower
      range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
      range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      range.select(); //Select the range (make it the visible selection
    }
  }

  const deleteThisPost = async () => {
    console.log("go")
  }

  useEffect(() => {
    getCurrentPost();
  }, []);

  useEffect(() => {
    checkLike();
  }, [currPost]);

  return currPostProgress ? (
    <Row>
      <Col
        lg={{ span: 9, offset: 1 }}
        className="post-detail d-flex flex-column"
      >
        <div className="d-flex justify-content-start postdetail-head">
          <div>
            <Image
              className="image-post-detail"
              src="https://www.premierchoicegroup.com/wp-content/uploads/place-holder-avatar.jpg"
              roundedCircle
            />
          </div>
          <div className="post-detail-content">
            <b>{currPost.author}</b>
            <small className="text-muted">
              {" "}
              {/* {moment(currPost.created_at).format("hA, Do, MMMM")} */}
              {moment(currPost.created_at).fromNow()}
            </small>
            <p
              className="font-weight-normal"
              dangerouslySetInnerHTML={contentFormat(currPost.content)}
            ></p>
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
                {props.user.user.id == currPost.author_id ? (
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
        <hr></hr>
        <div className="d-flex justify-content-around">
          {progress ? (
            <Spinner animation="border" variant="danger" />
          ) : likeState ? (
            <button
              className="btn-function"
              style={{ color: "red" }}
              onClick={() => unLikeToggle()}
            >
              <i className="fas fa-heart"></i> {likeNumb} unlike
            </button>
          ) : (
            <button className="btn-function" onClick={() => likeToggle()}>
              <i className="far fa-heart"></i> {likeNumb} like
            </button>
          )}

          <button className="btn-function">
            <i className="fas fa-retweet"></i>
          </button>
          <button
            className="btn-function"
            onClick={() => {
              handleShow();
            }}
          >
            <i className="far fa-comment"></i> {commentsNumb}
          </button>
        </div>
      </Col>
      <Col
        lg={{ span: 8, offset: 2 }}
        sm={{ span: 8, offset: 2 }}
        className="mt-4"
      >
        {currPostComment &&
          currPostComment.map(comment => {
            return <Comment comment={comment} contentFormat={contentFormat} />;
          })}
      </Col>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{currPost.content}</p>
          <Form
            // className="d-flex flex-column"
            className="comment-section"
          >
            <div
              rows={5}
              name="content"
              id="commentCurrentpostMarkup"
              onKeyUp={e => {
                const inputMarkup = document.getElementById(
                  "commentCurrentpostMarkup"
                ).innerText;
                setComment(inputMarkup);
                if (comment !== inputMarkup) {
                  if (inputMarkup && inputMarkup.length > 0) {
                    let tempString = inputMarkup.split(" ").filter(Boolean);
                    const htmlString = tempString.map(item => {
                      if (item.charAt(0) === "#") {
                        item = `<span class="hastag-markup">${item}</span>`;
                        return item;
                      }
                      return item;
                    });

                    document.getElementById(
                      "commentCurrentpostMarkup"
                    ).innerHTML = htmlString.join(" ");
                  }
                }
                setEndOfContenteditable(e.target);
              }}
              suppressContentEditableWarning={true}
              contentEditable
            >
              {" "}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={event => handleCommentSubmit(event)}
          >
            Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  ) : (
    <Facebook className="loader-custom" />
  );
}