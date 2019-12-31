import React, { useEffect, useState } from "react";
import { Row, Col, InputGroup, FormControl } from "react-bootstrap";
import HashLoader from "react-spinners/HashLoader";

import TrendingHastag from "./TrendingHastag";
import { Divider } from "@material-ui/core";

import { useHistory } from "react-router-dom";

export default function Trending(props) {
  const [search, setSearch] = useState(null);

  const history = useHistory();
  const override = `
    display: block;
    margin: 10px auto;
    border-color: red;
    width:100%
`;
  //store data trending
  const [dataTrending, setDataTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

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
    document.title = "Trending";
  }, []);

  useEffect(() => {
    setLoadingTrending(true)
    getTrending();
    console.log("run when change change")
  }, [props.change]);

  return (
    <div className="d-flex flex-column ">
      <div style={{ marginTop: "10px" }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            history.push(`/search/` + search);
          }}
        >
          <FormControl
            onChange={e => setSearch(e.target.value)}
            className="trending-input"
            name="input"
            placeholder="Enter username"
            aria-label="Enter username"
            aria-describedby="basic-addon1"
          />
        </form>
      </div>
      <div className="trending-board">
        <h1 className="font-weight-light" style={{ paddingLeft: "10px" }}>
          Trending
        </h1>
        <Divider />
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
            return (
              <TrendingHastag
                key={`trendingHastag-${i}`}
                data={item}
                index={i}
              />
            );
          })
        )}
      </div>
      <div className="text-muted" style={{fontSize:"16px"}}>© 2019 <a href="https://khofolio.netlify.com" target="_blank">KhoaNguyen</a>, FS.</div>
    </div>
  );
}
