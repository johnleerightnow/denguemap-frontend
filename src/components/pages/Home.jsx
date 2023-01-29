import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import {
  GoogleMap,
  Polygon,
  useJsApiLoader,
  Marker,
  Circle,
} from '@react-google-maps/api';
import SearchBar from '../SearchBar';
import apiService from '../../services/apiservices';

const mapSearchContainer = {
  display: 'flex',
  padding: 32,
};

const mapStyle = {
  // width: '65vw',
  flex: 3,
  height: '80vh',
};

const searchStyles = {
  flex: 1,
  paddingLeft: 32,
};

const highoptions = {
  fillColor: 'red',
  fillOpacity: 0.35,
  strokeColor: 'red',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

const medoptions = {
  fillColor: '#FFA500',
  fillOpacity: 0.35,
  strokeColor: '#FFA500',
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
  strokeColor: '#0000FF',
  strokeOpacity: 0.9,
  strokeWeight: 2,
  fillColor: '#0000FF',
  fillOpacity: 0.2,
};

function Home() {
  const [libraries] = useState(['places']);
  const center = {
    lat: 1.36027,
    lng: 103.851759,
  };
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
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

  const onLoad = React.useCallback((map) => {
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
          setErrorMessage('User denied geolocation');
        },
      );
      setZoom(17);
    } else {
      setErrorMessage('Geolocation unavailable');
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
    setCurrentLatLng(address.frontlatlng);
    // await apiService
    //   .getNearestRiskAreaDistance(address)
    //   .then((results) => {
    //     return results.data;
    //     //setSearchResult(results.data)
    //     // console.log("results.data", results.data);
    //     // console.log("searchResult", searchResult);
    //   })
    //   .then((results2) => {
    //     console.log(results2);
    //     setSearchResult(results2);
    //   })
    //   .catch((err) => console.log("search err", err));
    const finalResults = await apiService.getNearestRiskAreaDistance(address);
    console.log('f', finalResults);
    setSearchResult(finalResults.data);

    console.log('searchResult', searchResult);
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
    console.log('searchResult', searchResult);
  }, [searchResult]);

  return isLoaded ? (
    <div style={mapSearchContainer}>
      <GoogleMap
        mapContainerStyle={mapStyle}
        center={currentLatLng}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={currentLatLng} />
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
              Search area is estimated to be within
              {' '}
              {searchResult.minimumDistance}
              {' '}
              metres of a
              {' '}
              {searchResult.riskAreaType.toLowerCase()}
              {' '}
              risk dengue cluster.
            </div>
          ) : searchResult.riskAreaType === 'low' ? (
            <div>You are more than 150 metres from a dengue cluster</div>
          ) : (
            ''
          )}
        </Grid>
      </div>
    </div>
  ) : (
    null
  );
}

export default React.memo(Home);
