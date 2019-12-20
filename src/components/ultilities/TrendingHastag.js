import React from "react";
import {Link} from "react-router-dom";

export default function TrendingHastag(props) {
  return (
    <div className="trending-detail" id={props.index == 1 ? "trending-border":""}>
      <p className="font-weight-lighter" style={{fontSize:"16px", margin:"0px"}}> {props.index + 1} - Trending </p>
      <Link to={`/trending/${props.data.name.replace("#","")}`}>{props.data.name}</Link>
      <p className="font-weight-normal">Tweeted {props.data.numb} times </p>
    </div>
  );
}
