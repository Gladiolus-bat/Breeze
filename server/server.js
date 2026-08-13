import dns from "dns";
dns.setServers(["1.1.1.1"]);

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

connectDB();

const app = express();
// enables cross-origin resource sharing
app.use(cors());

app.get('/', (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));