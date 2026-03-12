const mongoose = require("mongoose")
const mongoURI = process.env.mongoURI

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to postit Mongodb Database successfully");
    } catch (error) {
        console.error("connection failed:", error);
    }
}

module.exports = connectToMongo