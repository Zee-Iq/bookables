import { Box } from "@mui/system";
import { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import env from "../../config/env";
import { selectFilters } from "../../slices/filterSlice";

export default function Map() {
    const ref = useRef<HTMLDivElement>()
    const [map, setMap] = useState<Microsoft.Maps.Map | null>(null)
    const [finishedLoading, setFinishedLoading] = useState(false)
    const {selectedLocation, searchRadius} = useSelector(selectFilters)

    useLayoutEffect(() => {
        if(!map || !selectedLocation || !finishedLoading) return
        const location = new Microsoft.Maps.Location(selectedLocation.point.coordinates[0], selectedLocation.point.coordinates[1])
        map.setView({center: location, zoom: 10})
    }, [selectedLocation])
 
    useLayoutEffect(() => {
        if(window.Microsoft?.Maps?.Map) return setFinishedLoading(true);

        const listener = () => {
            setFinishedLoading(true)
        }

        window.addEventListener("load", listener, {once: true, passive: true})

        return () => {
            window.removeEventListener("load", listener)
        }
    }, [])

    useLayoutEffect(() => {
        if(!ref.current || !finishedLoading) return
        setMap(new Microsoft.Maps.Map(ref.current, {credentials: env.REACT_APP_BING_MAPS}))
        return () => {
            map?.dispose()
            setMap(null)
        }
    }, [finishedLoading])

    return <Box ref={ref} sx={{width: "400px", height: "400px"}}></Box>
}