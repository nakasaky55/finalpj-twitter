import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Col, Row, Button } from "react-bootstrap";
import { Image as ImageCloudinary, Transformation } from "cloudinary-react";
import { Divider, IconButton } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

export default function EditPost(props) {
  const param = useParams();
  const history = useHistory();
  const [editInput, setEditInput] = useState(null);
  const [currPost, setCurrPost] = useState("");
  const [editPicture, setEditPicture] = useState(null);
  console.log(editPicture);
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

  //get current post
  const getCurrentPost = async () => {
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

    if (data.state) {
      if (data.author_id != props.userid) {
        history.push("/");
      }
      setCurrPost(data);
      setEditInput(data.content);
    }
  };

  //edit post
  const editPost = async () => {
    const input = {
      input: editInput,
      content_image: editPicture
    };
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/posts/edit/${param.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(input)
      }
    );
    const data = await resp.json();
    if (data.message == "edited") {
      history.push("/");
    }
  };

  //encode uploaded picture
  const encoded = file => {
    const conv = new FileReader();
    conv.onload = fileLoadedEvent => {
      var srcData = fileLoadedEvent.target.result;
      var newImage = document.createElement("img");
      newImage.src = srcData;
      document.getElementById("edit-dummy").src = newImage.src;
      // document.getElementById("txt").value = document.getElementById(
      //   "dummy"
      // ).innerHTML;
      return setEditPicture(newImage.src);
    };
    conv.readAsDataURL(file);
  };

  useEffect(() => {
    getCurrentPost();
    document.getElementById("edit-markup").focus();
  }, []);
  return (
    <>
      <Row style={{ paddingTop: "15px" }}>
        <Col className="col-2 avatar-input">
          <ImageCloudinary
            cloudName="hslqp9lo2"
            publicId={currPost.author_ava_url || ""}
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
        <Col style={{ maxWidth: "80%" }}>
          <div
            rows={5}
            name="editContent"
            id="edit-markup"
            onKeyUp={e => {
              const inputMarkup = document.getElementById("edit-markup")
                .innerText;
              setEditInput(inputMarkup);
              if (editInput !== inputMarkup) {
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
                    "edit-markup"
                  ).innerHTML = htmlString.join(" ");
                }
              }
              setEndOfContenteditable(e.target);
            }}
            suppressContentEditableWarning={true}
            contentEditable
          >
            {currPost.content}
          </div>
          <Divider />
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
          <ImageCloudinary
            id="edit-dummy"
            cloudName="hslqp9lo2"
            publicId={currPost.content_img ? currPost.content_img : ""}
            responsive
            style={{ maxWidth: "100%" }}
          >
            <Transformation radius="25" crop="fill" />
          </ImageCloudinary>
        </Col>
        <Divider />
        <Col
          lg={{ span: 10, offset: 2 }}
          md={{ span: 10, offset: 2 }}
          sm={{ span: 10, offset: 2 }}
          xs={{ span: 10, offset: 2 }}
          className="d-flex justify-content-between align-items-center"
          style={{ marginTop: "10px" }}
        >
          <div>
            <input
              type="file"
              name="avatar"
              id="inputEditFile"
              onChange={e => {
                encoded(e.target.files[0]);
              }}
              style={{ display: "none" }}
            ></input>
            <label htmlFor="inputEditFile">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>
          <Button onClick={editPost}>Edit</Button>
        </Col>
      </Row>
    </>
  );
}
