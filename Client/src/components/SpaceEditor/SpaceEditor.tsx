import { Button, FormGroup, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Bookables from "types";

interface SpaceEditorProps {
  space?: Bookables.Space;
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const initialSpace: Pick<
  Bookables.Space,
  "bookables" | "description" | "name"
> & {
  address: Omit<Bookables.Address, "_id">;
  contactInformation: Omit<Bookables.ContactInformation, "_id">;
} = {
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

const SpaceEditor = ({ space }: SpaceEditorProps) => {
  const [updatedSpace, setUpdatedSpace] = useState<typeof initialSpace>(
    space || initialSpace
  );

  useEffect(() => {
    if(space) setUpdatedSpace(space)
    else setUpdatedSpace(initialSpace)
  }, [space]);
  return (
    <Paper sx={{ padding: 2 }}>
      <form>
        <FormGroup>
          <TextField
            label="name"
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
          <TextField
            label="Street Address"
            value={updatedSpace.address.addressLine}
            onChange={(e) =>
              setUpdatedSpace({
                ...updatedSpace,
                address: {
                  ...updatedSpace.address,
                  addressLine: e.target.value,
                },
              })
            }
          />
          <TextField
            label="City"
            value={updatedSpace.address.locality}
            onChange={(e) =>
              setUpdatedSpace({
                ...updatedSpace,
                address: {
                  ...updatedSpace.address,
                  locality: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Postal Code"
            value={updatedSpace.address.postalCode}
            onChange={(e) =>
              setUpdatedSpace({
                ...updatedSpace,
                address: {
                  ...updatedSpace.address,
                  postalCode: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Country"
            value={updatedSpace.address.countryRegion}
            onChange={(e) =>
              setUpdatedSpace({
                ...updatedSpace,
                address: {
                  ...updatedSpace.address,
                  countryRegion: e.target.value,
                },
              })
            }
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
        <Button>{!space ? "Create" : "Update"}</Button>
        <Button>Cancel</Button>
        {space ? <Button>Delete</Button> : null}
      </form>
      <pre>{JSON.stringify(space, null, 5)}</pre>
    </Paper>
  );
};

export default SpaceEditor;
