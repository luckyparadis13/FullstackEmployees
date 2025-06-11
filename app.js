import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import employeesRouter from "./api/employees.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve index.html

app.use("/employees", employeesRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;
