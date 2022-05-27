import Bookables from "types";


// initialState

 interface UserState {
    user: User | null;
}

const initialState: UserState = {

}

const userSlice = createSlice({
    name: "user",
     
})

export default userSlice.reducer;