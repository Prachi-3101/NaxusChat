import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("connection successful");
    } catch (error) {
        console.error("database successfully to DB");
        process.exit(0);
    }
};

export default connectDB;