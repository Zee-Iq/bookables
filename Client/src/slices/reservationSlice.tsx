import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import Bookables from "types";
import axios from "axios";
import { selectToken, selectUser } from "./userSlice";
import { LabeledLocation } from "./filterSlice";
import { stepperClasses } from "@mui/material";

enum ReservationProcessState {
  INITIAL,
  CLICKED,
  IS_LOGGED_IN,
  IS_TENANT,
  FINISHED,
}

type ReservationProcess = {
  state: ReservationProcessState;
  isCreating: boolean;
  newReservation: Bookables.PopulatedReservation | null;
  user: Bookables.User | null;
  bookable: Bookables.Bookable | null;
  from: string | null;
  to: string | null;
} & (
  | {
      state: ReservationProcessState.INITIAL;
      isCreating: false;
      newReservation: null;
      user: null;
      bookable: null;
      from: null;
      to: null;
    }
  | {
      state: ReservationProcessState.CLICKED;
      isCreating: false;
      newReservation: null;
      user: null;
      bookable: Bookables.Bookable;
      from: string;
      to: string;
    }
  | {
      state: ReservationProcessState.IS_LOGGED_IN;
      isCreating: false;
      newReservation: null;
      user: Bookables.User;
      bookable: Bookables.Bookable;
      from: string;
      to: string;
    }
  | {
      state: ReservationProcessState.IS_TENANT;
      isCreating: true;
      newReservation: null;
      user: Bookables.User;
      bookable: Bookables.Bookable;
      from: string;
      to: string;
    }
  | {
      state: ReservationProcessState.FINISHED;
      isCreating: true;
      newReservation: Bookables.PopulatedReservation;
      user: Bookables.User;
      bookable: Bookables.Bookable;
      from: string;
      to: string;
    }
);

const initialReservationProcess: ReservationProcess = {
  state: ReservationProcessState.INITIAL,
  isCreating: false,
  newReservation: null,
  bookable: null,
  from: null,
  to: null,
  user: null,
};

interface OwnReservations {
  isFetching: boolean;
  reservations: Bookables.PopulatedReservation[];
  error: unknown | null;
}

const initialOwnReservations: OwnReservations = {
  isFetching: false,
  reservations: [],
  error: null,
};

interface ReservationState {
  bookingProcess: ReservationProcess;
  ownReservations: OwnReservations;
}

const initialState: ReservationState = {
  bookingProcess: initialReservationProcess,
  ownReservations: initialOwnReservations,
};

const bookingSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOwnReservations.pending, (state) => {
        state.ownReservations.isFetching = true;
      })
      .addCase(fetchOwnReservations.fulfilled, (state, action) => {
        state.ownReservations.reservations = action.payload;
        state.ownReservations.isFetching = false;
      })
      .addCase(fetchOwnReservations.rejected, (state, action) => {
        state.ownReservations.isFetching = false;
        state.ownReservations.error = action.error;
      })
      .addCase(createReservation.pending, (state) => {
        state.bookingProcess.isCreating = true;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.bookingProcess.newReservation = action.payload;
        state.ownReservations.reservations.push(action.payload);
        state.bookingProcess.isCreating = false;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.ownReservations.isFetching = false;
        state.ownReservations.error = action.error;
      });
  },
});

export const fetchOwnReservations = createAsyncThunk<
  Bookables.PopulatedReservation[],
  void,
  { state: RootState }
>("reservation/fetchOwnReservations", async (_, thunkApi) => {
  const token = selectToken(thunkApi.getState());
  if (!token)
    thunkApi.rejectWithValue(
      new Error("fetchOwnReservation requires auth token")
    );
  const response = await axios.get("/reservations/own", {
    headers: { authorization: `bearer ${token}` },
  });
  const ownReservations: Bookables.PopulatedReservation[] = response.data;
  return ownReservations;
});

type ReservationInformation = Pick<
  Bookables.Reservation,
  "bookable" | "from" | "to"
>;

export const createReservation = createAsyncThunk<
  Bookables.PopulatedReservation,
  ReservationInformation,
  { state: RootState }
>("reservation/createReservation", async (reservationInformation, thunkApi) => {
  const token = selectToken(thunkApi.getState());
  if (!token)
    thunkApi.rejectWithValue(
      new Error("createReservation requires auth token")
    );
  const response = await axios.post(
    "/reservations/create",
    {
      from: reservationInformation.from.toISOString(),
      to: reservationInformation.to.toISOString(),
      bookable: reservationInformation.bookable,
    },
    {
      headers: { authorization: `bearer ${token}` },
    }
  );
  const newReservation: Bookables.PopulatedReservation = response.data;
  return newReservation;
});

// exporting filterReducer
const reservationReducer = bookingSlice.reducer;
export default reservationReducer;

// exporting selectors
export const selectOwnReservations = (state: RootState) =>
  state.reservation.ownReservations.reservations;

export const selectFetchingOwnReservations = (state: RootState) =>
  state.reservation.ownReservations;

// exporting actions
//export const {} = spacesSlice.actions;
