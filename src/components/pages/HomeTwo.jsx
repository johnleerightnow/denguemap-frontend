import React from "react";
import { GoogleMap, Polygon, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "1200px",
  height: "700px",
};

const center = {
  lat: 24.886,
  lng: -70.268,
};

const onLoad = (polygon) => {
  console.log("polygon: ", polygon);
};

const paths = [
  { lat: 25.774, lng: -80.19 },
  { lat: 18.466, lng: -66.118 },
  { lat: 32.321, lng: -64.757 },
  { lat: 25.774, lng: -80.19 },
];

function MyComponent() {
  const options = {
    fillColor: "lightblue",
    fillOpacity: 1,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
  };
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API}>
      <GoogleMap
        id="marker-example"
        mapContainerStyle={containerStyle}
        center={center}
        zoom={7}
      >
        <Polygon onLoad={onLoad} paths={paths} options={options} />
        {/* Child components, such as markers, info windows, etc. */}
        <></>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MyComponent);
