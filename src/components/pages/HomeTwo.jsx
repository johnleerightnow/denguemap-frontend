import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import CircularProgress from "@mui/material/CircularProgress";

const google = window.google;

// const options = {
//   zoomControlOptions: {
//     position: google.maps.ControlPosition.RIGHT_CENTER, // 'right-center' ,
//     // ...otherOptions
//   },
// };

const HomeTwo = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API, // ,
    // ...otherOptions
  });

  const Map = () => {
    // wrapping to a function is useful in case you want to access `window.google`
    // to eg. setup options or create latLng object, it won't be available otherwise
    // feel free to render directly if you don't need that
    const onLoad = React.useCallback(function onLoad(mapInstance) {
      // do something with map Instance
    });
    return (
      <GoogleMap onLoad={onLoad}>
        {
          // ...Your map components
        }
      </GoogleMap>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? Map() : <CircularProgress />;
};

export default HomeTwo;
