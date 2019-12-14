import React from "react";
import { Image } from "react-bootstrap";
import moment from 'moment'

export default function Comment(props) {
  return (
    <div className="d-flex justify-content-start postdetail-head">
      <div>
        <Image
          className="image-post-detail"
          src="https://www.premierchoicegroup.com/wp-content/uploads/place-holder-avatar.jpg"
          roundedCircle
        />
      </div>
      <div className="post-detail-content">
        <b>{props.comment.author}</b>
        <small className="text-muted"> {moment(props.comment.created_at).fromNow()}</small>
        <p
        // dangerouslySetInnerHTML={contentFormat()}
        className="font-weight-normal"
        dangerouslySetInnerHTML={props.contentFormat(props.comment.content)}
        ></p>
      </div>
    </div>
  );
}
