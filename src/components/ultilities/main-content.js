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
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";

import {
  Image as ImageCloudinary,
  Video,
  Transformation,
  CloudinaryContext
} from "cloudinary-react";
import { Divider, Popover, Popper } from "@material-ui/core";
import { Progress } from "antd";

export default function MainConent(props) {
  //control modal comment show/hide
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fileEncoded, setFileEncoded] = useState(null);
  const [loadingUpload, SetLoadingUpload] = useState(false);

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

  //create circle progress
  const [percentage, setPercentage] = useState(0);

  //popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClosePop = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //insert an icon
  const insertIcon = icon => {
    let markup = document.getElementById("input-markup").innerHTML;
    markup = markup + icon;
    setInput(markup)
    document.getElementById("input-markup").innerHTML = markup;
  };

  //create a new post
  const handleSubmit = async event => {
    setControlPosting(true);
    event.preventDefault();
    const tempHastag = input.split(" ").filter(item => item.charAt(0) === "#");

    const inputData = {
      content: input.trim(),
      hastags: tempHastag,
      file: fileEncoded
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
      props.setChange(input);
    }
    document.getElementById("input-markup").innerHTML = "";
    if (!controlPosting) {
      setInput("");
      document.getElementById("inputFile").value = "";
      setPercentage(0);
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
      setFileEncoded("");
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
    if (data.has_next == true && data.data_received.length > 0) {
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

  const removeImage = () => {
    document.getElementById("inputFile").value = "";
  };

  const encoded = file => {
    const conv = new FileReader();
    conv.onload = fileLoadedEvent => {
      var srcData = fileLoadedEvent.target.result;
      var newImage = document.createElement("img");
      newImage.src = srcData;
      document.getElementById("dummy").innerHTML = newImage.outerHTML;
      console.log(newImage.outerHTML);
      // document.getElementById("txt").value = document.getElementById(
      //   "dummy"
      // ).innerHTML;
      return setFileEncoded(
        document.getElementById("dummy").getElementsByTagName("img")[0].src
      );
    };
    conv.readAsDataURL(file);
  };

  //control contenteditable when focus
  function setOnClick(e) {
    const selected = document.getElementById(e.target.id);
    selected.style.borderStyle = "none ";
  }

  function setBlur(e) {
    const selected = document.getElementById(e.target.id);
    selected.style.borderStyle = "none";
  }

  function setFocus(e) {
    const selected = document.getElementById(e.target.id);
  }
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
    document.title = "Dashboard";
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
                flex-basis: 70%;
            }
            .maincontent_profile {
                flex-basis: 10%;
                display: flex;
                justify-content:center;
                align-items: flex-start;
            }
            .maincontent_profile img {
                // max-width: 80%;

            }
            .content{
              margin-top:20px;
            }
            .btn-post {
            border-radius: 15px;
            color: white;
            border: none;
            background-color:#1da1f2;
            width: 100px;
            margin-left: 10px;
            height:35px;
            }
            .maincontent_input_description{
                margin-top:10px;
                margin-bottom:10px;
                align-items:center;
            }
            button:disabled,
            button[disabled] {
                background-color: silver
            }
            #input-markup {
              min-height: 100px;
              color: black;
              border-radius:25px;
              padding:0 5px;
            }
            .avatar-input{
              display: flex;
              justify-content: center;
              align-items:flex-start;
            }
            .MuiSvgIcon-root{
              font-size:34px;
            }
            `}
      </style>
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <h1 className="font-weight-bold">Lastest Tweet</h1>
        </Col>
        <Divider style={{ width: "100%", marginBottom: "10px " }} />
        <Col className="col-2 avatar-input">
          <ImageCloudinary
            cloudName="hslqp9lo2"
            publicId={props.avaUrl ? props.avaUrl : ""}
            responsive
            // style={{ width: "100%", height: "100%" }}
          >
            <Transformation
              width="60"
              height="60"
              // gravity="face"
              responsive
              radius="max"
              crop="thumb"
            />
          </ImageCloudinary>
        </Col>
        <Col className="col-10">
          <div
            contentEditable="true"
            placeholder="What's on your mind ?"
            rows={4}
            name="content"
            id="input-markup"
            onKeyDown={e => {
              const inputMarkup = document.getElementById("input-markup")
                .innerText;
              setPercentage(inputMarkup.length / 130);
            }}
            onKeyUp={e => {
              let inputMarkup = document.getElementById("input-markup")
                .innerText;
              setInput(inputMarkup);
              if (input !== inputMarkup) {
                if (inputMarkup.length > 130) {
                  const extraText = inputMarkup.slice(130);
                  const normalText = inputMarkup.slice(0, 129);
                  const extraTextFormatted = `<span class="extra-text">${inputMarkup.slice(
                    130
                  )}</span>`;
                  inputMarkup = inputMarkup.replace(
                    extraText,
                    extraTextFormatted
                  );
                }
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
          >
            {/* <span style={{color:"grey"}}>What's on your mind ?</span> */}
          </div>
          <Divider style={{ width: "100%", padding: "0" }} />
          <div id="dummy" style={{ maxWidth: "100%" }}></div>
        </Col>
      </Row>

      <Row>
        <Col
          lg={{ span: 10, offset: 2 }}
          md={{ span: 10, offset: 2 }}
          sm={{ span: 10, offset: 2 }}
          xs={{ span: 10, offset: 2 }}
        >
          <div className="d-flex justify-content-between maincontent_input_description">
            <div className="d-flex">
              <input
                type="file"
                name="avatar"
                id="inputFile"
                onChange={e => {
                  encoded(e.target.files[0]);
                }}
                style={{ display: "none" }}
              ></input>
              <label htmlFor="inputFile">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>

              <div class="dropdown dropup">
                <a
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <IconButton color="primary" component="span">
                    <InsertEmoticonIcon />
                  </IconButton>
                </a>

                <div
                  class="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                  style={{ marginTop: "15px" }}
                >
                  <a
                    class="dropdown-item"
                    onClick={e => insertIcon(e.target.innerHTML)}
                  >
                    &#128512;
                  </a>
                  <a
                    class="dropdown-item"
                    onClick={e => insertIcon(e.target.innerHTML)}
                  >
                    &#128513;
                  </a>
                  <a
                    class="dropdown-item"
                    onClick={e => insertIcon(e.target.innerHTML)}
                  >
                    &#128514;
                  </a>
                  <a
                    class="dropdown-item"
                    onClick={e => insertIcon(e.target.innerHTML)}
                  >
                    &#128515;
                  </a>
                  <a
                    class="dropdown-item"
                    onClick={e => insertIcon(e.target.innerHTML)}
                  >
                    &#128516;
                  </a>
                  <a
                    class="dropdown-item"
                    onClick={e => insertIcon(e.target.innerHTML)}
                  >
                    &#128517;
                  </a>
                  <a
                    class="dropdown-item"
                    onClick={e => insertIcon(e.target.innerHTML)}
                  >
                    &#128518;
                  </a>
                  <a
                    class="dropdown-item"
                    onClick={e => insertIcon(e.target.innerHTML)}
                  >
                    &#128519;
                  </a>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              {/* {130 - input.length} characters remaining */}
              <Progress
                type="circle"
                percent={percentage * 100}
                status={percentage > 1 ? "exception" : ""}
                width={30}
              />
              <button
                // disabled={input.length > 130 || input.length === 0}
                className="btn-post"
                type="submit"
                onClick={e => handleSubmit(e)}
              >
                {controlPosting ? <Spinner animation="grow" /> : "Post"}
              </button>
            </div>
          </div>
        </Col>
      </Row>
      <Divider />
      <Row className="post-detail-background" style={{ paddingTop: "10px" }}>
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
                  key={`maincontent-${post.id}`}
                  post={post}
                  token={sessionStorage.getItem("token")}
                  user={props.user}
                  userid={props.user.user.id}
                  avaUrl={post.ava_url}
                  handleShow={handleShow}
                  setPostDetail={setPostDetail}
                  getPosts={getPosts}
                  content_img={post.content_img}
                />
              );
            })}
          </InfiniteScroll>
        )}
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
