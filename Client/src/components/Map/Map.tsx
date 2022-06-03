import { Box, BoxProps } from "@mui/material";
import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import env from "../../config/env";
import { LabeledLocation, selectFilters } from "../../slices/filterSlice";
import { selectSpacesInArea } from "../../slices/spacesSlice";

export let getMapSession: () => Promise<string> | null = () => null;

export default function Map(props: BoxProps) {
  let mapContainer = useRef<HTMLDivElement>();
  let map = useRef<Microsoft.Maps.Map>();
  let spacesLayer = useRef<Microsoft.Maps.Layer>();

  getMapSession = useCallback(() => (map.current ? new Promise(map.current.getCredentials) : null), [])

  const initializeSpacesLayer = useCallback((map: Microsoft.Maps.Map) => {
    if (spacesLayer.current) return;
    spacesLayer.current = new Microsoft.Maps.Layer("spaces");
    map.layers.insert(spacesLayer.current);
  }, []);

  const initializeMap = useCallback((parentElement: HTMLElement) => {
    if (!window.Microsoft?.Maps?.Map) return;
    if (map.current) return initializeSpacesLayer(map.current);
    map.current = new Microsoft.Maps.Map(parentElement, {
      credentials: env.REACT_APP_BING_MAPS,
      showMapTypeSelector: false,
      showLogo: false,
      showScalebar: true,
      showZoomButtons: false,
    });
    initializeSpacesLayer(map.current);
  }, []);

  const { selectedLocation, searchRadius } = useSelector(selectFilters);
  const spaces = useSelector(selectSpacesInArea);

  //Check if the Bing Maps is already loaded, if not register an event listener to do so
  useEffect(() => {
    if (!mapContainer.current) return;

    const listener = () => {
      if (!mapContainer.current) return;
      initializeMap(mapContainer.current);
    };

    if (window.Microsoft?.Maps?.Map) return initializeMap(mapContainer.current);
    window.addEventListener("load", listener, { once: true });

    return () => {
      window.removeEventListener("load", listener);
      map.current?.dispose();
      map.current = undefined;
      spacesLayer.current?.dispose();
      spacesLayer.current = undefined; 
    };
  }, []);

  //If the selectedLocation or searchRadius change, update the mapView
  useEffect(() => {
    if (!map.current || !selectedLocation || Number.isNaN(searchRadius)) return;
    
    setMapView(map.current, selectedLocation, searchRadius);
  }, [selectedLocation, searchRadius]);

  //If the spaces change, update the spacesLayer
  useEffect(() => {
    if (!map.current || !spacesLayer.current) return;
    spacesLayer.current.clear();
    spacesLayer.current.add(
      spaces.map((space) => {
        const location = new Microsoft.Maps.Location(
          space.point.coordinates[0],
          space.point.coordinates[1]
        );
        return new Microsoft.Maps.Pushpin(location);
      })
    );
  }, [spaces]);

  return (
    <Box
      sx={{ width: "100%", aspectRatio: "1/1" }}
      {...props}
      ref={(ref) => (mapContainer.current = ref as HTMLDivElement)}
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
