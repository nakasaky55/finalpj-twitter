import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Image as ImageCloud, Transformation } from "cloudinary-react";
import { useHistory } from "react-router-dom";
import moment from "moment";

export default function Retweet(props) {
  const history = useHistory();

  const [currPost, setCurrPost] = useState([]);
  const [currProgressRetweet, setCurrProgressRetweet] = useState(false);

  const getCurrentPost = async () => {
    setCurrProgressRetweet(true);
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/posts/${props.original_id}`,
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
      setCurrPost(data);
      setCurrProgressRetweet(false);
    }
  };

  const contentFormat = () => {
    const content = currPost.content.split(" ");
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

  useEffect(() => {
    getCurrentPost();
  }, [props]);

  // if (currProgressRetweet) return <h1>Loading</h1>;
  return (
    <Row
      className="retweet-section"
      onClick={e => {
        e.stopPropagation();
        history.push(`/post/${props.original_id}`);
      }}
    >
      <Col lg={2} md={2} sm={2} xs={2} className="avatar-input">
        <ImageCloud
          style={{ margin: "0px" }}
          cloudName="hslqp9lo2"
          publicId={
            currPost.author_ava_url
              ? currPost.author_ava_url
              : "download_qc5n9t"
          }
          responsive
        >
          <Transformation
            width="40"
            height="40"
            // gravity="face"
            responsive
            radius="max"
            crop="thumb"
          />
        </ImageCloud>
      </Col>
      <Col>
        <div>
          <b
            onClick={e => {
              e.stopPropagation();
              history.push(`/user/${currPost.author_id}`);
            }}
          >
            {currPost.author}
          </b>
          <small className="text-muted">
            {" "}
            {moment(currPost.created_at).format("MMM, Do")}
          </small>
          <p
            className="font-weight-normal"
            // dangerouslySetInnerHTML={contentFormat()}
          >
            {currPost.content}
          </p>
        </div>
      </Col>
      <Row>
        <Col className="d-flex justify-content-center image-post">
          <ImageCloud
            cloudName="hslqp9lo2"
            publicId={currPost.content_img ? currPost.content_img : ""}
            responsive
            style={{ maxWidth: "100%" }}
          >
            <Transformation radius="25" crop="fill" />
          </ImageCloud>
        </Col>
      </Row>
    </Row>
  );
}
