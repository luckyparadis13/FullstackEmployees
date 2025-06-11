import db from "#db/client";
import { createEmployee } from "#db/employees";

seedEmployees();

async function seedEmployees() {
  try {
    await db.connect();
    console.log("📡 Connected to DB");

    // Optional: clear old data
    await db.query("DELETE FROM employees");
    console.log("🧹 Cleared existing employees");

    for (let i = 0; i < 15; i++) {
      const employee = {
        name: `Employee ${i + 1}`,
        birthday: "1990-01-01", // realistic date
        salary: Math.floor(Math.random() * 100000) + 30000,
      };
      await createEmployee(employee);
    }

    console.log("🌱 Seeded 15 employees");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await db.end();
    console.log("🔌 DB connection closed");
  }
}
