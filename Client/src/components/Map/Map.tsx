import { Box, BoxProps } from "@mui/material";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import env from "../../config/env";
import { LabeledLocation, selectFilters } from "../../slices/filterSlice";
import { selectSpaces } from "../../slices/spacesSlice";

export let getMapSession: () => Promise<string> | null = () => null;

export default function Map(props: BoxProps) {
  const ref = useRef<HTMLDivElement>();
  const { selectedLocation, searchRadius } = useSelector(selectFilters);
  const [map, setMap] = useState<Microsoft.Maps.Map | null>(null);
  const [spacesLayer, setSpacesLayer] = useState<Microsoft.Maps.Layer | null>(
    null
  );
  const spaces = useSelector(selectSpaces);

  //Check if the Bing Maps is already loaded, if not register an event listener to do so
  useLayoutEffect(() => {
    if (!ref.current) return;
    let map: Microsoft.Maps.Map | null = null;
    let spacesLayer: Microsoft.Maps.Layer | null = null;

    if (window.Microsoft?.Maps?.Map) {
      return initializeMap(ref.current);
    }

    const listener = () => {
      if (!ref.current) return;
      initializeMap(ref.current);
    };

    window.addEventListener("load", listener, { once: true });

     return () => {
      window.removeEventListener("load", listener);
      map?.dispose();
      setMap(null);
      spacesLayer?.dispose();
      setSpacesLayer(null);
    }; 

    function initializeMap(
      parentElement: HTMLElement,
    ) {
      map = new Microsoft.Maps.Map(parentElement, {
        credentials: env.REACT_APP_BING_MAPS,
        showMapTypeSelector: false,
        showLogo: false,
        showScalebar: true,
        showZoomButtons: false,
      });
      setMap(map);
  
      spacesLayer = new Microsoft.Maps.Layer("spaces");
      map.layers.insert(spacesLayer);
      setSpacesLayer(spacesLayer);
    }
  }, []);


  //If the map changes, set the exported getMapSession function
  useEffect(() => {
    if (!map) {
      getMapSession = () => null;
      return;
    }
    getMapSession = () => new Promise(map.getCredentials);

    return () => {
      getMapSession = () => null;
    };
  }, [map]);

  //If the selectedLocation or searchRadius change, update the mapView
  useLayoutEffect(() => {
    if (!map || !selectedLocation) return;
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

  return <Box  sx={{ width: "100%", aspectRatio: "1/1" }} {...props} ref={ref}></Box>;
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
