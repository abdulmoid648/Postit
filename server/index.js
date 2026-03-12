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

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle React Router routes (redirect unknown routes to index.html)
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
