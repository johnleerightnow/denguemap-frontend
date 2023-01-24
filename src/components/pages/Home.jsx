import React from "react";
import apiService from "../../services/apiservices";

import { GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "90vw",
  height: "80vh",
};

// const paths = [
//   { lat: 1.37129127901326, lng: 103.896797104678 },
//   { lat: 1.3703341378617, lng: 103.89756024755 },
//   { lat: 1.37070261656649, lng: 103.898052393435 },
//   { lat: 1.3703777867222, lng: 103.898335898822 },
// ];

const options = {
  fillColor: "red",
  fillOpacity: 0.35,
  strokeColor: "red",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

const medoptions = {
  fillColor: "#FFA500",
  fillOpacity: 0.35,
  strokeColor: "#FFA500",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

const Home = () => {
  const center = {
    lat: 1.36027,
    lng: 103.851759,
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
  });

  const [map, setMap] = React.useState(null);
  const [highRisk, setHighRisk] = React.useState([]);
  const [medRisk, setMedRisk] = React.useState([]);
  const [currentLatLng, setCurrentLatLng] = React.useState(center);
  const [zoom, setZoom] = React.useState(10);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.setZoom(12);
    getDengueClusters();
    getCurrentLatLng();

    setMap(map);
  }, []);

  const getCurrentLatLng = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          this.setState({
            errorMessage: "User denied geolocation",
            currentLatLng: {
              lat: this.props.center.lat,
              lng: this.props.center.lng,
            },
          });
        }
      );
      setZoom(17);
    } else {
      this.setState({
        errorMessage: "Geolocation unavailable",
        currentLatLng: {
          lat: this.props.center.lat,
          lng: this.props.center.lng,
        },
      });
    }
  };

  const getDengueClusters = () => {
    apiService
      .getClustersFromDB()
      .then((results) => {
        setHighRisk(results.data.high);
        setMedRisk(results.data.med);
      })
      .catch((err) => console.log(err));
  };

  // const onPolyLoad = (polygon) => {
  //   console.log("polygon: ", polygon);
  // };

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <React.Fragment>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLatLng}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Polygon onLoad={onLoad} paths={highRisk} options={options} />
        <Polygon onLoad={onLoad} paths={medRisk} options={medoptions} />
      </GoogleMap>
    </React.Fragment>
  ) : (
    <></>
  );
};

export default Home;
