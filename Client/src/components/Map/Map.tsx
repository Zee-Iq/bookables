import { Box, BoxProps } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useStore } from "react-redux";
import Bookables from "types";
import env from "../../config/env";
import { useAppDispatch, useAppStore } from "../../hooks";
import {
  LabeledLocation,
  selectFilters,
  setMapBox,
  setMapCenter,
} from "../../slices/filterSlice";
import {
  fetchSpacesInArea,
  selectSpacesInArea,
} from "../../slices/spacesSlice";

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
  const dispatch = useAppDispatch();
  const { selectedLocation } = useSelector(selectFilters);
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
      const map = initializeMap();
      Microsoft.Maps.Events.addHandler(map, "viewchangeend", (e) => {
        const location = map.getCenter();
        const box = map.getBounds();
        const nw = box.getNorthwest();
        const se = box.getSoutheast();
        dispatch(
          setMapCenter({
            longitude: location.longitude,
            latitude: location.latitude,
          })
        );
        dispatch(
          setMapBox({
            nw: [nw.longitude, nw.latitude],
            se: [se.longitude, se.latitude],
          })
        );
        dispatch(fetchSpacesInArea());
      });
      
      createPushpins(initializeSpacesLayer(map), spaces);
    };

    if (MapStateObserver.mapReady) return init();
    MapStateObserver.onReady(init);
    return () => {
      MapStateObserver.removeCallback(init);
      if (MapStateObserver.mapReady && spacesLayer.current)
        spacesLayer.current.dispose();
      if (MapStateObserver.mapReady && map.current) map.current.dispose();
    };
  }, []);

  //If the selectedLocation or searchRadius change, update the mapView
  useEffect(() => {
    if (!map.current || !selectedLocation) return;
    setMapView(map.current, selectedLocation);
  }, [selectedLocation]);

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
      id="map"
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
) {
  console.log(selectedLocation);

  const locationRect = Microsoft.Maps.LocationRect.fromEdges(
    selectedLocation.bbox[2],
    selectedLocation.bbox[1],
    selectedLocation.bbox[0],
    selectedLocation.bbox[3]
  );
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
        space.point.coordinates[1],
        space.point.coordinates[0]
      );
      return new Microsoft.Maps.Pushpin(location);
    })
  );
}

function degree(rad: number) {
  return (rad / Math.PI) * 180;
}
