import express from "express";
import db from "../db/client.js"; // adjust path if needed

const router = express.Router();

// GET /employees - fetch all
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM employees ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /employees/:id - fetch single
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM employees WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /employees - create new
router.post("/", async (req, res, next) => {
  const { name, birthday, salary, role, department } = req.body;

  if (!name || !birthday || !salary) {
    return res
      .status(400)
      .json({ error: "Name, birthday, and salary are required." });
  }

  try {
    const result = await db.query(
      `INSERT INTO employees (name, birthday, salary, role, department)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, birthday, salary, role, department]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /employees/:id - update existing
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, birthday, salary, role, department } = req.body;

  try {
    const result = await db.query(
      `UPDATE employees
       SET name = $1, birthday = $2, salary = $3, role = $4, department = $5
       WHERE id = $6
       RETURNING *`,
      [name, birthday, salary, role, department, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /employees/:id - delete
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted", employee: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
