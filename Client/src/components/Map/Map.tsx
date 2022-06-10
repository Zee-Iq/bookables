import { Box, BoxProps } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useStore } from "react-redux";
import Bookables from "types";
import env from "../../config/env";
import { useAppStore } from "../../hooks";
import { LabeledLocation, selectFilters } from "../../slices/filterSlice";
import { selectSpacesInArea } from "../../slices/spacesSlice";

declare global {
  interface Window {
    setMapReady: () => void;
  }
}

const MapStateObserver: {
  callbacks: ((value: boolean) => void)[];
  onReady: (cb: (value: boolean) => void) => void;
  removeCallback: (cb: Function) => void;
  mapReady: boolean;
  setMapReady: () => void;
  loadingStarted: boolean;
} = {
  callbacks: [],
  onReady(cb) {
    this.callbacks.push(cb);
  },
  removeCallback(cb: Function) {
    this.callbacks = this.callbacks.filter((func) => cb !== func);
  },
  mapReady: false,
  setMapReady() {
    this.mapReady = true;
    for (const cb of this.callbacks) {
      cb(this.mapReady);
    }
  },
  loadingStarted: false,
};

export let getMapSession: () => Promise<string> | null = () => null;

export default function Map(props: BoxProps) {
  let mapContainer = useRef<HTMLDivElement>();
  let map = useRef<Microsoft.Maps.Map>();
  let spacesLayer = useRef<Microsoft.Maps.Layer>();
  const { selectedLocation, searchRadius } = useSelector(selectFilters);
  const spaces = useSelector(selectSpacesInArea);
  const store = useAppStore();

  getMapSession = useCallback(
    () => (map.current ? new Promise(map.current.getCredentials) : null),
    []
  );

  const initializeSpacesLayer = useCallback((map: Microsoft.Maps.Map) => {
    if (spacesLayer.current) return spacesLayer.current;
    spacesLayer.current = new Microsoft.Maps.Layer("spaces");
    map.layers.insert(spacesLayer.current);
    return spacesLayer.current as Microsoft.Maps.Layer;
  }, []);

  const initializeMap = useCallback(() => {
    if (map.current) return map.current;
    map.current = new Microsoft.Maps.Map(mapContainer.current as any, {
      credentials: env.REACT_APP_BING_MAPS,
      showMapTypeSelector: false,
      showLogo: false,
      showScalebar: true,
      showZoomButtons: false,
    });
    return map.current;
  }, []);

  useEffect(() => {
    if (!MapStateObserver.loadingStarted) loadMapsPackage();

    const init = () => {
      const spaces = selectSpacesInArea(store.getState());
      createPushpins(initializeSpacesLayer(initializeMap()), spaces);
    };

    if(MapStateObserver.mapReady) return init()
    MapStateObserver.onReady(init);
    return () => {
      MapStateObserver.removeCallback(init);
      if(MapStateObserver.mapReady && spacesLayer.current) spacesLayer.current.dispose()
      if(MapStateObserver.mapReady && map.current) map.current.dispose()
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
    createPushpins(spacesLayer.current, spaces);
  }, [spaces]);

  return (
    <Box
      sx={{ width: "100%", aspectRatio: "1/1" }}
      {...props}
      ref={mapContainer}
    ></Box>
  );
}

function loadMapsPackage() {
  let script = document.createElement("script");
  script.src = `https://www.bing.com/api/maps/mapcontrol?callback=setMapReady&key=${env.REACT_APP_BING_MAPS}`;
  document.body.append(script);

  window.setMapReady = MapStateObserver.setMapReady.bind(MapStateObserver);
  MapStateObserver.loadingStarted = true;
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

function createPushpins(
  spacesLayer: Microsoft.Maps.Layer,
  spaces: Bookables.Space[]
) {
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
}

function radiusToAngle(radius: number) {
  const EARTH_RADIUS_KM = 6371.001;
  return degree(Math.atan(radius / 2 / EARTH_RADIUS_KM) * 2);
}

function degree(rad: number) {
  return (rad / Math.PI) * 180;
}
