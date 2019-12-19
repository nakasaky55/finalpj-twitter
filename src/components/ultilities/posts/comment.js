import React from "react";
import { Image, Row, Col } from "react-bootstrap";
import moment from "moment";
import { Image as ImageCloud, Transformation } from "cloudinary-react";

export default function Comment(props) {
  return (
    <Row noGutters="true">
      <Col lg={2} md={2} sm={4} xs={4}>
        <ImageCloud
          cloudName="hslqp9lo2"
          publicId={props.avaUrl ? props.avaUrl : ""}
          responsive
        >
          <Transformation
            width="60"
            height="60"
            // gravity="face"
            responsive
            radius="max"
            crop="thumb"
          />
        </ImageCloud>
      </Col>
      <Col
        className="post-detail-content flex-column"
        style={{ width: "100%" }}
      >
        <div className="d-flex">
          <b>
            {props.comment.author}{" "}
            <span className="text-muted font-weight-normal">
              {" "}
              {moment(props.comment.created_at).fromNow()}
            </span>
          </b>
        </div>
        <p
          // dangerouslySetInnerHTML={contentFormat()}
          className="font-weight-normal"
          dangerouslySetInnerHTML={props.contentFormat(props.comment)}
        ></p>
      </Col>
    </Row>
  );
}
