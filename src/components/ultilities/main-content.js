import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Image,
  Form,
  Container,
  Spinner,
  Modal,
  Button
} from "react-bootstrap";
import PostDetail from "./posts/postDetail";
import { List } from "react-content-loader";
import InfiniteScroll from "react-infinite-scroll-component";

export default function MainConent(props) {
  //control modal comment show/hide
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //get input to create post when user submit
  const [input, setInput] = useState("");

  //check status of creating a post
  const [controlPosting, setControlPosting] = useState(false);

  //posts to display on main content
  const [posts, setPosts] = useState([]);

  //infor get from a post
  const [postDetail, setPostDetail] = useState(null);

  //start page
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(false);

  //create a new post
  const handleSubmit = async event => {
    setControlPosting(true);
    event.preventDefault();
    const tempHastag = input.split(" ").filter(item => item.charAt(0) === "#");

    const inputData = {
      content: input.trim(),
      hastags: tempHastag
    };
    const resp = await fetch(`${process.env.REACT_APP_PATH}/posts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + sessionStorage.getItem("token")
      },
      body: JSON.stringify(inputData)
    });
    const data = await resp.json();

    setControlPosting(false);

    if (data.message == "created") {
      setPosts([]);
      getPosts(1);
    }
    document.getElementById("input-markup").innerHTML = "";
    if (!controlPosting) {
      setInput("");
    }
  };

  //create a comment:
  const createComment = async (e, id) => {
    e.preventDefault();
    const inputData = {
      content: input.trim()
    };
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/posts/${id}/create_comment`,
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
    }
  };

  //get all posts from api
  const getPosts = async arg => {
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/posts/get_posts/post&page=${arg}`,
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
    if (data.has_next == true) {
      setPage(data.page);
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    if (arg == 1) {
      setPosts(data.data_received);
    } else setPosts(posts.concat(data.data_received));
    setControlPosting(false);
  };

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

  //Get post when token is existed in local storage
  useEffect(() => {
    getPosts(1);
  }, [sessionStorage.getItem("token")]);

  //reset info get from a post when close model
  useEffect(() => {
    if (show == false) {
      setPostDetail(null);
      setInput("");
    } else console.log("stay");
  }, [show]);

  return (
    <>
      <style>
        {`
            .maincontent_top {
                display: flex;
                justify-content: space-around;
            }
            .maincontent_input {
                width:70%;
            }
            .maincontent_profile {
                width: 20%
            }
            .maincontent_profile img {
                max-width: 100%
            }
            .btn-post {
            border-radius: 15px;
            color: white;
            border: none;
            background-color:#1da1f2;
            width: 100px;
            margin-left: 10px;
            }
            .maincontent_input_description{
                margin-top:20px;
            }
            button:disabled,
            button[disabled] {
                background-color: silver
            }
            #input-markup {
              min-height: 100px;
              background-color: white;
              color: black;
              border: 1px solid black;
            }
            
            `}
      </style>
      <Row>
        <Col className="maincontent_top" lg={{ span: 9, offset: 1 }}>
          <div className="maincontent_profile bg-white">
            <Image
              src="https://www.premierchoicegroup.com/wp-content/uploads/place-holder-avatar.jpg"
              roundedCircle
            />
          </div>
          <Form
            className="maincontent_input d-flex flex-column"
            onSubmit={e => {
              handleSubmit(e);
            }}
          >
            <div
              rows={5}
              name="content"
              id="input-markup"
              onChange={e => {
                console.log("run");
              }}
              onKeyUp={e => {
                const inputMarkup = document.getElementById("input-markup")
                  .innerText;
                setInput(inputMarkup);
                if (input !== inputMarkup) {
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
                      "input-markup"
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

            <div className="d-flex justify-content-end maincontent_input_description">
              <p>{130 - input.length} characters remaining</p>
              <button
                disabled={input.length > 130 || input.length === 0}
                className="btn-post"
                type="submit"
              >
                {controlPosting ? <Spinner animation="grow" /> : "Post"}
              </button>
            </div>
          </Form>
        </Col>
      </Row>
      <Row>
        <Container>
          {props.loadUser || controlPosting ? (
            <Row>
              <List className="loader-custom" />
            </Row>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={() => getPosts(page)}
              hasMore={hasMore}
              loader={<List className="loader-custom" />}
            >
              {posts.map(post => {
                return (
                  <PostDetail
                    key={post.id}
                    post={post}
                    token={sessionStorage.getItem("token")}
                    user={props.user}
                    userid={props.user.user.id}
                    avaUrl={post.ava_url}
                    handleShow={handleShow}
                    setPostDetail={setPostDetail}
                    getPosts={getPosts}
                  />
                );
              })}
            </InfiniteScroll>
          )}
        </Container>
      </Row>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{postDetail}</p>
          <Form
            // className="d-flex flex-column"
            className="comment-section"
            onSubmit={e => handleSubmit(e)}
          >
            <div
              rows={5}
              name="content"
              id="comment-markup"
              onKeyUp={e => {
                const inputMarkup = document.getElementById("comment-markup")
                  .innerText;
                setInput(inputMarkup);
                if (input !== inputMarkup) {
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
                      "comment-markup"
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
            onClick={event => createComment(event, postDetail)}
          >
            Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
