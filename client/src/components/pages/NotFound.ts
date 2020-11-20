import React, { useContext, useEffect } from "react";

import AppContext from "./../../context/app/AppContext";

const NotFound = props => {
  const appContext = useContext(AppContext);
  const { setLocation } = appContext;

  useEffect(() => {
    setLocation("notFound");
  }, []);

  return (
    <div className="m-1" style={{ display: "block" }}>
      <h1>Not Found</h1>
      <p className="lead">The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;