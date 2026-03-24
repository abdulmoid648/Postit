const express = require("express");
const path = require("path");
require("dotenv").config();
var cors = require("cors");
const connectToMongo = require("./db.js");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
connectToMongo();

app.use(express.json());

// API routes
app.use("/api/user", require("./routes/userRoute.js"));
app.use("/api/post", require("./routes/postRoute.js"));

// Export app for Vercel serverless integration
module.exports = app;

// Start server locally (Vercel sets NODE_ENV to production)
if (process.env.NODE_ENV !== "production") {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
