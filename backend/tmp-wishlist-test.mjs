import dotenv from "dotenv";
import mongoose from "mongoose";
import { Wishlist } from "./src/models/wishlist.model.js";
import { User } from "./src/models/user.model.js";
import { SearchCache } from "./src/models/searchCache.model.js";
import { toggleWishlist, getWishlist } from "./src/controllers/user.controller.js";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
await Wishlist.syncIndexes();

const cache = await SearchCache.findOne({ normalizedQuery: "heels" }).lean();
const products = cache?.result?.products || [];
const tempUser = await User.create({
  fullname: "Temp Wishlist User",
  email: `temp-${Date.now()}@example.com`,
  password: "Password123!",
});

const createRes = () => {
  const state = { statusCode: null, payload: null };
  return {
    state,
    status(code) {
      state.statusCode = code;
      return this;
    },
    json(payload) {
      state.payload = payload;
      return this;
    },
  };
};

const next = (error) => {
  if (error) throw error;
};

try {
  const firstRes = createRes();
  await toggleWishlist({ user: tempUser, body: { product: products[0] } }, firstRes, next);

  const secondRes = createRes();
  await toggleWishlist({ user: tempUser, body: { product: products[1] } }, secondRes, next);

  const listRes = createRes();
  await getWishlist({ user: tempUser }, listRes, next);

  console.log(JSON.stringify({
    firstCount: firstRes.state.payload?.data?.length,
    secondCount: secondRes.state.payload?.data?.length,
    listCount: listRes.state.payload?.data?.length,
    productKeys: listRes.state.payload?.data?.map((item) => item.productKey),
  }, null, 2));
} finally {
  await Wishlist.deleteMany({ user: tempUser._id });
  await User.deleteOne({ _id: tempUser._id });
  await mongoose.disconnect();
}
