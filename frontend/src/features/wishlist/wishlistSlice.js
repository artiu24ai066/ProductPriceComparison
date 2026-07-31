import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const normalizeWishlistKey = (value = "") => value.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const initialState = {
    items: [],
    loading: false,
    error: null,
};

export const loadWishlist = createAsyncThunk(
    "wishlist/loadWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/users/wishlist");
            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || "Failed to load wishlist");
        }
    }
);

export const toggleWishlistItem = createAsyncThunk(
    "wishlist/toggleWishlistItem",
    async (product, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/wishlist/toggle", { product });
            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || "Failed to update wishlist");
        }
    }
);

export const removeWishlistItem = createAsyncThunk(
    "wishlist/removeWishlistItem",
    async (productKey, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/users/wishlist/${encodeURIComponent(normalizeWishlistKey(productKey))}`);
            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || "Failed to remove wishlist item");
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(loadWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load wishlist";
            })
            .addCase(toggleWishlistItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleWishlistItem.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(toggleWishlistItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update wishlist";
            })
            .addCase(removeWishlistItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeWishlistItem.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(removeWishlistItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to remove wishlist item";
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export { normalizeWishlistKey };
export default wishlistSlice.reducer;
