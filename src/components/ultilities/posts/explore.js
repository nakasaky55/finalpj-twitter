import React, { useState, useEffect } from "react";

import PostDetail from "../posts/postDetail"

export default function Explore() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([])
console.log(data)
  const getExplore = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_PATH}/posts/explore/page=${page}`,
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
    if(data.message == "success"){
        setData(data.data);
    }
    if(data.has_next){
        setPage(data.page)
    }
  };

  useEffect(()=>{
      getExplore()
  },[])
  return (
      data.map(item => {
          return <PostDetail post={item} />
      })
  )
}
