const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("✅ Servidor corriendo en el puerto 3000"));
