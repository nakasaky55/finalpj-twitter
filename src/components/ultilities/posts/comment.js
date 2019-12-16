import React from "react";
import { Image } from "react-bootstrap";
import moment from "moment";
import { Image as ImageCloud, Transformation } from "cloudinary-react";

export default function Comment(props) {
  return (
    <div className="d-flex justify-content-start postdetail-head">
      <div>
        <ImageCloud
          cloudName="hslqp9lo2"
          publicId={props.avaUrl ? props.avaUrl : ""}
          responsive
          style={{ maxWidth: "60px", margin: "0 10px" }}
        >
          <Transformation gravity="face" radius="max" crop="thumb" />
          <Transformation angle="15" />
          <Transformation effect="trim" />
        </ImageCloud>
      </div>
      <div className="post-detail-content">
        <b>{props.comment.author}</b>
        <small className="text-muted">
          {" "}
          {moment(props.comment.created_at).fromNow()}
        </small>
        <p
          // dangerouslySetInnerHTML={contentFormat()}
          className="font-weight-normal"
          dangerouslySetInnerHTML={props.contentFormat(props.comment.content)}
        ></p>
      </div>
    </div>
  );
}
