import mongoose from "mongoose";

const connectDB = async () => {
    const mongodbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/resumebuilder";

    try {
        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully");
        });

        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error.message);
        });

        await mongoose.connect(mongodbURI);
    } catch (error) {
        const redactedURI = mongodbURI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");
        console.error("MongoDB connection failed.");
        console.error("Current MONGODB_URI (redacted):", redactedURI);
        console.error("If you are using MongoDB Atlas, confirm the DNS/cluster is reachable and the URI is correct.");
        console.error("For local development, use: mongodb://127.0.0.1:27017/resumebuilder");
        throw error;
    }
};

export default connectDB;