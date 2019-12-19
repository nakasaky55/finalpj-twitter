import React from "react";
import { Image as ImageCloud, Transformation } from "cloudinary-react";

export default function ProfileCard(props) {
  return (
    <div className="d-flex justify-content-between">
      {/* Left    */}
      <div>
        <ImageCloud
          style={{ margin: "0px" }}
          cloudName="hslqp9lo2"
          publicId={props.user.ava_url ? props.user.ava_url : "download_qc5n9t"}
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
        <div>
          <p>{props.user.username}</p>
        </div>
      </div>
      <div>Followbutton</div>
    </div>
  );
}
