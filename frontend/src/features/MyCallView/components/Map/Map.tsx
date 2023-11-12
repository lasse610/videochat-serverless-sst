/* eslint-disable import/no-webpack-loader-syntax */
import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
// @ts-ignore
import mapboxgl, { Marker } from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
interface MapProps {
  latitude: string;
  longitude: string;
}

export default function Map(props: MapProps) {
  const map = useRef<mapboxgl.Map>();
  const mapContainer = useRef<HTMLDivElement>(null);
  const lng = props.longitude;
  const lat = props.latitude;
  const zoom = 9;
  const accessToken =
    process.env.REACT_APP_MAPBOX_API_TOKEN ||
    "pk.eyJ1IjoibGFzc2UtdGFtbWVsYSIsImEiOiJjbDZxdWVvYjIwZDN4M2twYmwweXU2bHF2In0.M4qvGXMDw6vuvj0gzketUQ";
  console.log(accessToken);
  mapboxgl.accessToken = accessToken;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    new Marker({
      color: "#084298",
    })
      .setLngLat([lng, lat])
      .addTo(map.current!);
  }, [lat, lng, zoom]);

  return (
    <Box sx={{ width: "300px", height: "300px" }}>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: "100%", height: "100%" }}
      ></div>
    </Box>
  );
}
