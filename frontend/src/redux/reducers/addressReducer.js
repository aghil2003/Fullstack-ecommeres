// import { createSlice } from "@reduxjs/toolkit";
// import { fetchAddresses, saveAddress, deleteAddress } from "../actions/addressActions";

// const initialState = {
//     addresses: [],
//     selectedAddress: null,
//     loading: false,
//     error: null,
// };

// const addressSlice = createSlice({
//     name: "address",
//     initialState,
//     reducers: {
//         selectAddress: (state, action) => {
//             state.selectedAddress = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchAddresses.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchAddresses.fulfilled, (state, action) => {
//                 console.log("Fetched addresses:", action.payload); 
//                 state.loading = false;
//                 state.addresses = action.payload;
//             })
//             .addCase(fetchAddresses.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })
//             .addCase(saveAddress.fulfilled, (state, action) => {
//                 const existingIndex = state.addresses.findIndex(addr => addr._id === action.payload._id);
//                 if (existingIndex >= 0) {
//                     state.addresses[existingIndex] = action.payload;
//                 } else {
//                     state.addresses.push(action.payload);
//                 }
//             })
//             .addCase(deleteAddress.fulfilled, (state, action) => {
//                 state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
//             });
//     },
// });

// export const { selectAddress } = addressSlice.actions;
// export default addressSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import { fetchAddresses, saveAddress, deleteAddress } from "../actions/addressActions";

const initialState = {
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null,
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        selectAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Save Address
            .addCase(saveAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveAddress.fulfilled, (state, action) => {
                state.loading = false;
                console.log("New Address Added:", action.payload);

                const existingIndex = state.addresses.findIndex(addr => addr._id === action.payload._id);
                if (existingIndex >= 0) {
                    state.addresses[existingIndex] = action.payload;
                } else {
                    state.addresses.push(action.payload);
                }
            })
            .addCase(saveAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Address
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
            });
    },
});

export const { selectAddress } = addressSlice.actions;
export default addressSlice.reducer;
