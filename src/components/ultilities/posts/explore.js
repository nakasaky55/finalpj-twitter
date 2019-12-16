import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { List } from "react-content-loader";

import PostDetail from "../posts/postDetail";

export default function Explore() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");

  //infor get from a post
  const [postDetail, setPostDetail] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getExplore = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/posts/explore/page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data_received = await resp.json();
    if (data_received.message == "success") {
      setData(data.concat(data_received.data));
    }
    if (data_received.has_next) {
      setPage(data_received.page);
      setHasMore(true)
    }else setHasMore(false)
  };

  //create comment
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

  useEffect(() => {
    document.title="Explore"
    getExplore();
  }, []);
  return (
    <>
      <InfiniteScroll
        dataLength={data.length}
        next={() => getExplore()}
        hasMore={hasMore}
        loader={<List className="loader-custom" />}
      >
        {data.map(item => {
          return (
            <PostDetail
              post={item}
              handleShow={handleShow}
              setPostDetail={setPostDetail}
            />
          );
        })}
      </InfiniteScroll>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            // className="d-flex flex-column"
            className="comment-section"
            // onSubmit={e => handleSubmit(e)}
          >
            <div
              rows={5}
              name="content"
              id="comment-explore-markup"
              onKeyUp={e => {
                const inputMarkup = document.getElementById(
                  "comment-explore-markup"
                ).innerText;
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
                      "comment-explore-markup"
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
