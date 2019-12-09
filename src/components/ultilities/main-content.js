import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Image,
  Form,
  Container
} from "react-bootstrap";
import PostDetail from "./posts/postDetail";

export default function MainConent(props) {
  const [input, setInput] = useState("");
  const [controlPosting, setControlPosting] = useState(false);

  //posts to display on main content
  const [posts, setPosts] = useState([]);

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
        Authorization: "Token " + props.token
      },
      body: JSON.stringify(inputData)
    });
    const data = await resp.json();
    
    setControlPosting(false);
    setInput("");
    document.getElementById("input-markup").innerHTML = "";
  };

  const getPosts = async () => {
    
    const resp = await fetch(`${process.env.REACT_APP_PATH}/posts/get_posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + props.token
      }
    });
    const data = await resp.json();
    setPosts(data.data_received);
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

  const getPost = async () => {
    const resp = await fetch("https://127.0.0.1:5000/posts/get_posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + props.token
      }
    });
    const data = await resp.json();
  };

  useEffect(() => {
    getPosts();
  }, [props.findToken === true]);
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
            onSubmit={e => handleSubmit(e)}
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
                Post
              </button>
            </div>
          </Form>
        </Col>
      </Row>
      <Row>
        <Container>
          {posts.map(post => {
            return <PostDetail post={post} token={props.token} user={props.user}/>;
          })}
        </Container>
      </Row>
    </>
  );
}
