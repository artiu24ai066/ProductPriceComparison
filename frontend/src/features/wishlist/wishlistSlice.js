import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const normalizeWishlistKey = (value = "") => value.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const stableHash = (value = "") => {
    const input = value.toString();
    let hash = 0;

    for (let index = 0; index < input.length; index += 1) {
        hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
    }

    return Math.abs(hash).toString(16);
};

const canonicalizeWishlistValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(canonicalizeWishlistValue);
    }

    if (value && typeof value === "object") {
        return Object.keys(value)
            .sort()
            .reduce((result, key) => {
                if (["lastUpdated", "createdAt", "updatedAt", "__v"].includes(key)) {
                    return result;
                }

                const normalizedValue = canonicalizeWishlistValue(value[key]);
                if (normalizedValue !== undefined) {
                    result[key] = normalizedValue;
                }
                return result;
            }, {});
    }

    if (value === undefined) {
        return undefined;
    }

    return value;
};

const getSellerUrls = (product = {}) => {
    const sellers = Array.isArray(product?.sellers) ? product.sellers : [];
    return sellers
        .map((seller) => seller?.url || seller?.affiliateUrl || "")
        .filter(Boolean)
        .sort();
};

const buildWishlistKey = (product = {}) => {
    if (!product || typeof product !== "object") {
        return normalizeWishlistKey(product);
    }

    const primarySellerUrl = product.lowestPriceSeller?.url || product.cheapestAvailableSeller?.url || product.sellers?.[0]?.url || product.url || "";
    const baseKey = [
        product.groupId,
        product.canonicalTitle,
        primarySellerUrl,
    ]
        .filter(Boolean)
        .join("::");

    return `wk_${stableHash(baseKey || JSON.stringify(canonicalizeWishlistValue(product) || {}))}`;
};

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
            const response = await api.delete(`/users/wishlist/${encodeURIComponent((productKey || "").toString().trim())}`);
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
export { normalizeWishlistKey, buildWishlistKey };
export default wishlistSlice.reducer;
