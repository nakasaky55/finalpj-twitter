import React, { useState } from "react";
import { Image as ImageCloud, Transformation } from "cloudinary-react";
import { useHistory } from "react-router-dom";

export default function ProfileCard(props) {
  const history = useHistory();
  const [controlClick, setControlClick] = useState(false);
  const [isFollowing, setIsFollowing] = useState(props.user.is_follower);

  const follow = async () => {
    setControlClick(true);
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/follow/${props.user.user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data = await url.json();
    if (data.message == "success") {
      props.user.is_follower = true;
      setIsFollowing(!isFollowing);
    }
  };

  const unfollow = async () => {
    setControlClick(true);
    const url = await fetch(
      `${process.env.REACT_APP_PATH}/user/unfollow/${props.user.user_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      }
    );
    const data = await url.json();
    if (data.message == "success") {
      setIsFollowing(!isFollowing);
    }
  };

  return (
    <div className="d-flex justify-content-between">
      {/* Left    */}
      <div
        className="profile-header"
        onClick={() => history.push(`/user/${props.user.user_id}`)}
      >
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
      <div>
        {isFollowing ? (
          <button className="btn-follow" onClick={unfollow}>
            Following
          </button>
        ) : (
          <button className="btn-follow" onClick={follow}>
            Follow
          </button>
        )}
      </div>
    </div>
  );
}
