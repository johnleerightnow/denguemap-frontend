import React, { useEffect } from "react";

const DengueInfo = () => {
  useEffect(() => {
    window.location.replace(
      "https://www.nea.gov.sg/dengue-zika/stop-dengue-now"
    );
  }, []);
  return <></>;
};

export default DengueInfo;
