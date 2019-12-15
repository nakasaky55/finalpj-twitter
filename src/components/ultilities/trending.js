import React, { useEffect, useState } from "react";
import { Row, Col, InputGroup, FormControl } from "react-bootstrap";
import HashLoader from "react-spinners/HashLoader";

import TrendingHastag from "./TrendingHastag";

export default function Trending() {
  const override = `
    display: block;
    margin: 10px auto;
    border-color: red;
    width:100%
`;
  //store data trending
  const [dataTrending, setDataTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  const submitSearch = async e => {
    e.preventDefault();
    console.log("object", e.target.input.value);
  };

  const getTrending = async () => {
    const resp = await fetch(`${process.env.REACT_APP_PATH}/posts/hastags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    });
    const data = await resp.json();
    if (data.message == "success") {
      setDataTrending(data.data);
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    getTrending();
  }, []);

  return (
    <div className="d-flex flex-column">
      <div>
        <form onSubmit={e => submitSearch(e)}>
          <FormControl
            className="trending-input"
            name="input"
            placeholder="Enter your curious"
            aria-label="Enter your curious"
            aria-describedby="basic-addon1"
          />
        </form>
      </div>
      <div className="trending-board">
        <h1>Trending</h1>
        {loadingTrending ? (
          <HashLoader
            css={override}
            //   sizeUnit={"px"}
            //   size={150}
            color={"#1da1f2"}
            loading={true}
          />
        ) : (
          dataTrending.map((item, i) => {
            return <TrendingHastag data={item} index={i} />;
          })
        )}
      </div>
      <div>Credit</div>
    </div>
  );
}
