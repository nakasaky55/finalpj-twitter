import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Search() {
  const [search, setSearch] = useState(null);

  const history = useHistory();
  return (
    <form
      style={{ padding: "10px 5px" }}
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
  );
}
