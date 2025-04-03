
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


// Fetch Addresses
export const fetchAddresses = createAsyncThunk("address/fetch", async (_, { rejectWithValue }) => {
    try {
        const token = Cookies.get("token");
        if (!token) throw new Error("Authentication required!");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId || decodedToken.id;

        console.log("Fetching addresses for user:", userId); // Debugging

        const response = await axiosInstance.get(`/address/${userId}`);
        console.log("API Response:", response.data); // Debugging

        return response.data.addresses || [];
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
    }
});

// Save Address
export const saveAddress = createAsyncThunk("address/save", async (address, { rejectWithValue }) => {
    try {
        const token = Cookies.get("token");
        if (!token) throw new Error("Authentication required!");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId || decodedToken.id;

        const response = await axiosInstance.post(`/address/${userId}`, address);
        console.log("New Address Response:", response.data); // Debugging

        return response.data; // Ensure this contains the new address with _id
    } catch (error) {
        console.error("Error saving address:", error);
        return rejectWithValue(error.response?.data?.message || "Failed to save address");
    }
});

// Delete Address
export const deleteAddress = createAsyncThunk("address/delete", async (addressId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/address/${addressId}`);
        return addressId;
    } catch (error) {
        console.error("Error deleting address:", error);
        return rejectWithValue(error.response?.data?.message || "Failed to delete address");
    }
});
