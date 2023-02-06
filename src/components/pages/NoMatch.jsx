import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NoMatch = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/signin");
    }, 1200);
  }, []);
  return <h1>404 No such page exists</h1>;
};

export default NoMatch;
