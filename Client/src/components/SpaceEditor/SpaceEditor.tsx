import {
  Autocomplete,
  Button,
  FormGroup,
  Paper,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Bookables from "types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  createSpace,
  deleteSpace,
  SpaceInformation,
  updateSpace,
  selectOwnedSpace,
  selectCreatedSpace,
} from "../../slices/spacesSlice";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { getMapSession } from "../Map/Map";
import env from "../../config/env";
import axios from "axios";
import BookablesEditor from "../BookablesEditor/BookablesEditor";

interface SpaceEditorProps {
  space?: Bookables.Space;
}

const initialSpace: SpaceInformation = {
  address: {
    addressLine: "",
    adminDistrict: "",
    adminDistrict2: "",
    countryRegion: "",
    formattedAddress: "",
    locality: "",
    postalCode: "",
  },
  bookables: [] as Bookables.Bookable[],
  contactInformation: {
    email: "",
    phoneNumber: "",
  },
  description: "",
  name: "",
};

type Suggestions = {
  addressLine: string[];
  locality: string[];
  postalCode: string[];
  countryRegion: string[];
};

const initialSuggestion = {
  addressLine: [],
  locality: [],
  postalCode: [],
  countryRegion: [],
};

const SpaceEditor = (props: SpaceEditorProps) => {
  const location = useLocation();
  const createdSpace = useAppSelector(selectCreatedSpace);
  const { spaceId } = useParams();
  const space = useAppSelector(selectOwnedSpace(spaceId));
  const [updatedSpace, setUpdatedSpace] = useState<SpaceInformation>(
    space || initialSpace
  );
  const [fetchingSuggestions, setFetchingSuggestions] =
    useState<boolean>(false);

  const [suggestions, setSuggestions] =
    useState<Suggestions>(initialSuggestion);

  const dispatch = useAppDispatch();

  const debouncedFetchAutosuggest = useCallback(
    (() => {
      let timeout: NodeJS.Timeout | null = null;
      return (address: Partial<Bookables.Address>) => {
        if (timeout) clearTimeout(timeout);
        setFetchingSuggestions(true);
        timeout = setTimeout(() => {
          fetchAutosuggest(address).then((suggestion) => {
            setSuggestions(suggestion);
            setFetchingSuggestions(false);
          });
        }, 500);
      };
    })(),
    []
  );

  useEffect(() => {
    setSuggestions(initialSuggestion);
    if (space) setUpdatedSpace(space);
    else setUpdatedSpace(initialSpace);
  }, [space]);

  console.log("space", space);
  console.log("suggestions", suggestions)

  useEffect(() => {
    debouncedFetchAutosuggest(updatedSpace.address);
  }, [updatedSpace.address]);

  if (
    createdSpace &&
    !location.pathname.includes(createdSpace._id as unknown as string)
  )
    return <Navigate to={"./" + createdSpace._id} />;

  return (
    <Paper sx={{ padding: 2 }}>
      <form>
        <FormGroup>
          <TextField
            label="Name"
            value={updatedSpace.name}
            onChange={(e) =>
              setUpdatedSpace({ ...updatedSpace, name: e.target.value })
            }
          />
          <TextField
            label="description"
            value={updatedSpace.description}
            onChange={(e) =>
              setUpdatedSpace({ ...updatedSpace, description: e.target.value })
            }
          />
        </FormGroup>
        <FormGroup>
          <Autocomplete
            renderInput={(props) => (
              <TextField {...props} label="Street Address and Number" />
            )}
            inputValue={updatedSpace.address.addressLine}
            onInputChange={(_, value) =>
              setUpdatedSpace({
                ...updatedSpace,
                address: {
                  ...updatedSpace.address,
                  addressLine: value,
                },
              })
            }
            options={suggestions.addressLine}
            filterOptions={(opts) => opts}
            loading={fetchingSuggestions}
            freeSolo
          />
          <Autocomplete
            options={suggestions.locality}
            filterOptions={(opts) => opts}
            inputValue={updatedSpace.address.locality}
            onInputChange={(_, value) =>
              setUpdatedSpace({
                ...updatedSpace,
                address: {
                  ...updatedSpace.address,
                  locality: value,
                },
              })
            }
            renderInput={(props) => <TextField {...props} label="City" />}
            loading={fetchingSuggestions}
            freeSolo
          />
          <Autocomplete
            options={suggestions.postalCode}
            filterOptions={(opts) => opts}
            inputValue={updatedSpace.address.postalCode}
            onInputChange={(_, value) =>
              setUpdatedSpace({
                ...updatedSpace,
                address: {
                  ...updatedSpace.address,
                  postalCode: value,
                },
              })
            }
            renderInput={(props) => (
              <TextField {...props} label="Postal Code" />
            )}
            loading={fetchingSuggestions}
            freeSolo
          />

          <Autocomplete
            options={suggestions.countryRegion}
            filterOptions={(opts) => opts}
            inputValue={updatedSpace.address.countryRegion}
            onInputChange={(_, value) =>
              setUpdatedSpace({
                ...updatedSpace,
                address: {
                  ...updatedSpace.address,
                  countryRegion: value,
                },
              })
            }
            renderInput={(props) => <TextField {...props} label="Country" />}
            loading={fetchingSuggestions}
            freeSolo
          />
        </FormGroup>
        <FormGroup>
          <TextField
            label="Email"
            value={updatedSpace.contactInformation.email}
            onChange={(e) =>
              setUpdatedSpace({
                ...updatedSpace,
                contactInformation: {
                  ...updatedSpace.contactInformation,
                  email: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Phone Number"
            value={updatedSpace.contactInformation.phoneNumber}
            onChange={(e) =>
              setUpdatedSpace({
                ...updatedSpace,
                contactInformation: {
                  ...updatedSpace.contactInformation,
                  phoneNumber: e.target.value,
                },
              })
            }
          />
        </FormGroup>
        {space && <BookablesEditor bookables={space.bookables} spaceId={space._id as unknown as string} />}
        {!space ? (
          <Button onClick={() => dispatch(createSpace(updatedSpace))}>
            Create
          </Button>
        ) : (
          <Button
            onClick={() =>
              dispatch(
                updateSpace({
                  ...updatedSpace,
                  spaceId: space._id as unknown as string,
                })
              )
            }
          >
            Update
          </Button>
        )}
        <Button onClick={() => setUpdatedSpace(space || initialSpace)}>
          Cancel
        </Button>
        {space ? (
          <Button
            onClick={() =>
              dispatch(deleteSpace(space._id as unknown as string))
            }
          >
            Delete
          </Button>
        ) : null}
      </form>
    </Paper>
  );
};

export default SpaceEditor;

async function fetchAutosuggest(
  {
    addressLine,
    countryRegion,
    locality,
    postalCode,
  }: Partial<Bookables.Address>,
  signal?: AbortSignal
): Promise<Suggestions> {
  const key = (await getMapSession()) || env.REACT_APP_BING_MAPS;
  if (!(addressLine || countryRegion || locality || postalCode))
    return {
      addressLine: [],
      locality: [],
      postalCode: [],
      countryRegion: [],
    };
  const response = await axios.get(
    "http://dev.virtualearth.net/REST/v1/Locations",
    {
      params: { key, addressLine, countryRegion, locality, postalCode, maxResults: 20 },
      signal,
    }
  );

  const suggestions = response.data.resourceSets[0].resources.reduce(
    (suggestions: Suggestions, location: Bookables.Location) => {
      for (const key in suggestions) {
        if (Object.prototype.hasOwnProperty.call(suggestions, key)) {
          const value = location.address[key as keyof typeof suggestions];
          if (value) suggestions[key as keyof typeof suggestions].push(value);
        }
      }
      return suggestions;
    },
    {
      addressLine: [],
      locality: [],
      postalCode: [],
      countryRegion: [],
    }
  );
  for (const key in suggestions) {
    if (Object.prototype.hasOwnProperty.call(suggestions, key)) {
      suggestions[key] = Array.from(new Set(suggestions[key]));
    }
  }
  return suggestions;
}
