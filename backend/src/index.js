import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from './app.js';
dotenv.config({
    path: './.env'
})

console.log("Mongo URI:", process.env.MONGODB_URI);
connectDB()
    
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.error("MongoDB connection failed!", error);
})
