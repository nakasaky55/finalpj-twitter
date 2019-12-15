import React from "react";
import {Link} from "react-router-dom";

export default function TrendingHastag(props) {
  console.log(props);
  return (
    <div className="trending-detail" id={props.index == 1 ? "trending-border":""}>
      <h3 className="font-weight-lighter"> {props.index + 1} - Trending </h3>
      <Link to={`/trending/${props.data.name}`}>{props.data.name}</Link>
      <p>Tweeted {props.data.numb} </p>
    </div>
  );
}
