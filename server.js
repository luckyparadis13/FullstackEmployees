import express from "express";

import employeesRouter from "./routes/employees.js";
import db from "./db/client.js"; // ensure connection works
import cors from "cors"; // for frontend dev

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount the employees router at /employees
app.use("/employees", employeesRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 API is up and running!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something broke!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌍 Server listening on port ${PORT}`);
});
