import React from "react";

import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

import mapStyles from "./mapStyles";
import "./LocationSearchModal.css";

const mapContainerStyle = {
  height: "50vh",
  width: "100%",
};

export default function LocationShowModal({ latitude, longitude }) {
  var latitude = parseFloat(latitude);
  var longitude = parseFloat(longitude);
  const center = {
    lat: latitude,
    lng: longitude,
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD5q0qFJOf1N3lSQUZAZbsbLgBV3U8GwBk",
  });
  const [marker, setMarker] = React.useState([]);
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        onLoad={onMapLoad}
      >
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    </div>
  );
}
