import { Box, BoxProps } from "@mui/material";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import env from "../../config/env";
import { LabeledLocation, selectFilters } from "../../slices/filterSlice";
import { selectSpacesInArea } from "../../slices/spacesSlice";

export let getMapSession: () => Promise<string> | null = () => null;

export default function Map(props: BoxProps) {
  let { current: mapContainer } = useRef<HTMLDivElement>();
  let { current: map } = useRef<Microsoft.Maps.Map>();
  let { current: spacesLayer } = useRef<Microsoft.Maps.Layer>();

  const initializeSpacesLayer = useCallback((map: Microsoft.Maps.Map) => {
    if (spacesLayer) return;
    spacesLayer = new Microsoft.Maps.Layer("spaces");
    map.layers.insert(spacesLayer);
  }, []);

  const initializeMap = useCallback((parentElement: HTMLElement) => {
    if(!window.Microsoft?.Maps?.Map) return
    if (map) return initializeSpacesLayer(map);
    map = new Microsoft.Maps.Map(parentElement, {
      credentials: env.REACT_APP_BING_MAPS,
      showMapTypeSelector: false,
      showLogo: false,
      showScalebar: true,
      showZoomButtons: false,
    });
    initializeSpacesLayer(map);
    getMapSession = () => map ? new Promise(map.getCredentials) : null
  }, []);

  const { selectedLocation, searchRadius } = useSelector(selectFilters);
  const spaces = useSelector(selectSpacesInArea);

  //Check if the Bing Maps is already loaded, if not register an event listener to do so
  useLayoutEffect(() => {
    if (!mapContainer) return;

    const listener = () => {
      if (!mapContainer) return;
      initializeMap(mapContainer);
    };

    initializeMap(mapContainer)
    window.addEventListener("load", listener, { once: true });

    return () => {
      window.removeEventListener("load", listener);
    };
  }, []);

  //If the selectedLocation or searchRadius change, update the mapView
  useLayoutEffect(() => {
    if (!map || !selectedLocation || Number.isNaN(searchRadius)) return;
    setMapView(map, selectedLocation, searchRadius);
  }, [map, selectedLocation, searchRadius]);

  //If the spaces change, update the spacesLayer
  useLayoutEffect(() => {
    if (!map || !spacesLayer) return;
    spacesLayer.clear();
    spacesLayer.add(
      spaces.map((space) => {
        const location = new Microsoft.Maps.Location(
          space.point.coordinates[0],
          space.point.coordinates[1]
        );
        return new Microsoft.Maps.Pushpin(location);
      })
    );
  }, [spaces, spacesLayer, map]);

  return (
    <Box
      sx={{ width: "100%", aspectRatio: "1/1" }}
      {...props}
      ref={(ref) => (mapContainer = ref as HTMLDivElement)}
    ></Box>
  );
}

function setMapView(
  map: Microsoft.Maps.Map,
  selectedLocation: LabeledLocation,
  searchRadius: number
) {
  const location = new Microsoft.Maps.Location(
    selectedLocation.point.coordinates[0],
    selectedLocation.point.coordinates[1]
  );
  const angle = radiusToAngle(searchRadius);
  const locationRect = new Microsoft.Maps.LocationRect(location, angle, angle);
  map.setView({ bounds: locationRect });
}

function radiusToAngle(radius: number) {
  const EARTH_RADIUS_KM = 6371.001;
  return degree(Math.atan(radius / 2 / EARTH_RADIUS_KM) * 2);
}

function degree(rad: number) {
  return (rad / Math.PI) * 180;
}
