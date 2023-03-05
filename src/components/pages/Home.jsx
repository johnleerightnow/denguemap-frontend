import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import {
  GoogleMap,
  Polygon,
  useJsApiLoader,
  Marker,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";
import apiService from "../../services/apiservices";
import SearchBar from "../SearchBar";
import "./home.css";
import { getScreen } from "../../util";

const mapStyle = {
  flex: 3,
  height: "80vh",
  minWidth: 344,
  minHeight: 400,
};

const searchStyles = {
  flex: 1,
  border: "1px solid grey",
  borderRadius: 8,
  // to make responsive while changing without reload, we need to add eventListener
  // For static device, this should be okay
  marginLeft: getScreen().mobile ? 0 : 16,
  marginTop: getScreen().mobile ? 16 : 0,
  padding: 16,
  paddingTop: 0,
};

const highoptions = {
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

const circleoptions = {
  radius: 150,
  strokeColor: "#00FF00",
  strokeOpacity: 0.9,
  strokeWeight: 2,
  fillColor: "#00FF00",
  fillOpacity: 0.2,
};

const Home = () => {
  const [libraries] = useState(["places"]);
  const center = {
    lat: 1.36027,
    lng: 103.851759,
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
    libraries,
  });

  const [map, setMap] = React.useState(null);
  const [highRisk, setHighRisk] = React.useState([]);
  const [medRisk, setMedRisk] = React.useState([]);
  const [currentLatLng, setCurrentLatLng] = React.useState(center);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [searchResult, setSearchResult] = useState({});
  const [zoom, setZoom] = React.useState(10);
  const [selectPlace, setSelectedPlace] = useState({});
  const [activeMarker, setActiveMarker] = useState({});
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeInfoWindowResults, setActiveInfoWindowResults] = useState({
    address: "",
    search: "",
  });

  function createCenterControl(mapc) {
    const controlButton = document.createElement("button");
    // Set CSS for the control.
    controlButton.style.backgroundColor = "#fff";
    controlButton.style.border = "2px solid #fff";
    controlButton.style.borderRadius = "3px";
    controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlButton.style.color = "rgb(25,25,25)";
    controlButton.style.cursor = "pointer";
    controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
    controlButton.style.fontSize = "11px";
    controlButton.style.lineHeight = "38px";
    controlButton.style.margin = "7px";
    controlButton.style.padding = "0 5px";
    controlButton.style.textAlign = "center";
    controlButton.textContent = "Center";
    controlButton.title = "Click to recenter the map";
    controlButton.type = "button";
    // Setup the click event listeners: simply set the map to Chicago.
    controlButton.addEventListener("click", () => {
      mapc.setCenter(currentLatLng);
      console.log("currentLatLng Button", currentLatLng);
    });
    return controlButton;
  }

  const onLoad = React.useCallback((map) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.setZoom(12);
    getDengueClusters();
    getCurrentLatLng();
    // Create the DIV to hold the control.
    const centerControlDiv = document.createElement("div");
    // Create the control.
    const centerControl = createCenterControl(map);
    // console.log("map", map.controls);
    // console.log("window", window.google);
    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl);
    // if (map && map.controls) {
    //   map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(
    //     centerControlDiv
    //   );
    // }
    setMap(map);
  }, []);

  const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15,
  };

  const getCurrentLatLng = () => {
    if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition((pos) =>
      //   console.log("pos", pos)
      // );
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const frontlatlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const latLng = JSON.stringify(
            `${position.coords.latitude},${position.coords.longitude}`
          );

          handleNewAddress({ frontlatlng, latLng, obj: {} });
          /* setCurrentLatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }); */
        },
        (err) => {
          setErrorMessage("User denied geolocation");
        }
      );
      setZoom(13);
    } else {
      setErrorMessage("Geolocation unavailable");
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

  const onUnmount = React.useCallback((map) => {
    setMap(null);
  }, []);

  const handleNewAddress = async (address) => {
    setActiveInfoWindowResults({ address: "", search: "" });
    setCurrentLatLng(address.frontlatlng);
    const finalResults = await apiService.getNearestRiskAreaDistance(address);
    setSearchResult(finalResults.data);
    console.log("finalResults.data", finalResults.data);

    if (address && address.address) {
      setActiveInfoWindowResults({ address: address.address, search: "yes" });
    } else if (address && address.frontlatlng) {
      const reverseGeoResults = await apiService.reverseGeocode(
        address.frontlatlng
      );
      // console.log(reverseGeoResults.data.results[0].formatted_address);
      if (
        reverseGeoResults.data.results &&
        reverseGeoResults.data.status === "OK"
      ) {
        setActiveInfoWindowResults({
          address: reverseGeoResults.data.results[0].formatted_address,
        });
      }
    } else {
    }

    setZoom(16);
  };

  /**
   * setSearchResult(finalResults.data)
   * This line works in async manner, so when you use setState to set any state,
   * at that time a new thread is created and for that
   * and rest of your synchronous code runs.
   * Here:
   * LN#139 was set to run for some later time, but  LN#141 ran before that,
   * and that's the reason why we don't see expected results on LN#141.
   */
  React.useEffect(() => {
    // console.log("searchResult", searchResult);
    console.log("currentLatLng", currentLatLng);
    console.log("activeInfoWindowResults", activeInfoWindowResults);
  }, [searchResult, currentLatLng, activeInfoWindowResults]);

  const mapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
  };

  const markerMouseOver = (props) => {
    setShowingInfoWindow(true);
  };

  const markerMouseOut = () => {
    setShowingInfoWindow(false);
  };

  /* const iconOptions =  */

  return isLoaded ? (
    <div className='mapSearchContainer'>
      <GoogleMap
        mapContainerStyle={mapStyle}
        center={currentLatLng}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        <Marker
          /*  icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"} */
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillOpacity: 1,
            strokeWeight: 2,
            fillColor: "#5384ED",
            strokeColor: "#ffffff",
          }}
          onMouseOver={markerMouseOver}
          onMouseOut={markerMouseOut}
          position={currentLatLng}
        >
          {showingInfoWindow && (
            <InfoWindow position={currentLatLng}>
              <div style={divStyle}>
                <h3>
                  {activeInfoWindowResults.address === ""
                    ? "Unable to fetch address"
                    : activeInfoWindowResults.address}
                </h3>
                <h4>The 150m radius is demarcated by the green circle</h4>
              </div>
            </InfoWindow>
          )}
        </Marker>

        <Circle center={currentLatLng} options={circleoptions} />
        <Polygon onLoad={onLoad} paths={highRisk} options={highoptions} />
        <Polygon onLoad={onLoad} paths={medRisk} options={medoptions} />
      </GoogleMap>
      <div style={searchStyles}>
        <Grid sx={{ mt: 3 }}>
          <SearchBar newaddress={handleNewAddress} />
        </Grid>
        <Grid sx={{ mt: 3 }}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {searchResult.isWithinRiskArea ? (
            <div>
              {activeInfoWindowResults &&
              activeInfoWindowResults.search === "yes"
                ? "Search"
                : "Your"}{" "}
              area is estimated to be within {searchResult.minimumDistance}{" "}
              metres of a {searchResult.riskAreaType.toLowerCase()} risk dengue
              cluster.
            </div>
          ) : searchResult.riskAreaType === "low" ? (
            <div>
              {activeInfoWindowResults &&
              activeInfoWindowResults.search === "yes"
                ? "Search"
                : "Your"}{" "}
              area is more than 150 metres from a dengue cluster
            </div>
          ) : (
            ""
          )}
        </Grid>
      </div>
    </div>
  ) : null;
};

export default React.memo(Home);
