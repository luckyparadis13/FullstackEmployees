// db/employees.js
import db from "./client.js";

/** @returns the employee created according to the provided details */
export async function createEmployee({
  name,
  birthday,
  salary,
  role,
  department,
}) {
  const sql = `
    INSERT INTO employees (name, birthday, salary, role, department)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const {
    rows: [employee],
  } = await db.query(sql, [name, birthday, salary, role, department]);
  return employee;
}

/** @returns all employees */
export async function getEmployees() {
  const sql = `
    SELECT * FROM employees;
  `;
  const { rows: employees } = await db.query(sql);
  return employees;
}

/**
 * @returns the employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function getEmployee(id) {
  const sql = `
    SELECT * FROM employees
    WHERE id = $1;
  `;
  const {
    rows: [employee],
  } = await db.query(sql, [id]);
  return employee;
}

/**
 * @returns the updated employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function updateEmployee({
  id,
  name,
  birthday,
  salary,
  role,
  department,
}) {
  const sql = `
    UPDATE employees
    SET name = $2,
        birthday = $3,
        salary = $4,
        role = $5,
        department = $6
    WHERE id = $1
    RETURNING *;
  `;
  const {
    rows: [employee],
  } = await db.query(sql, [id, name, birthday, salary, role, department]);
  return employee;
}

/**
 * @returns the deleted employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function deleteEmployee(id) {
  const sql = `
    DELETE FROM employees
    WHERE id = $1
    RETURNING *;
  `;
  const {
    rows: [employee],
  } = await db.query(sql, [id]);
  return employee;
}

/** Seeds the employees table with sample data */
export async function seedEmployees() {
  await db.query("DELETE FROM employees;");

  const sampleEmployees = [
    {
      name: "Jane Doe",
      birthday: "1990-01-01",
      salary: 70000,
      role: "Engineer",
      department: "Development",
    },
    {
      name: "John Smith",
      birthday: "1985-04-12",
      salary: 65000,
      role: "Manager",
      department: "Operations",
    },
    {
      name: "Alice Johnson",
      birthday: "1992-06-30",
      salary: 72000,
      role: "QA Analyst",
      department: "Quality Assurance",
    },
    {
      name: "Bob Brown",
      birthday: "1980-03-10",
      salary: 80000,
      role: "Designer",
      department: "UX",
    },
    {
      name: "Carol White",
      birthday: "1995-07-20",
      salary: 60000,
      role: "Support Rep",
      department: "Customer Service",
    },
    {
      name: "Dan Green",
      birthday: "1988-09-14",
      salary: 75000,
      role: "DevOps",
      department: "Infrastructure",
    },
    {
      name: "Eve Black",
      birthday: "1993-11-22",
      salary: 67000,
      role: "Data Analyst",
      department: "Data",
    },
    {
      name: "Frank Gold",
      birthday: "1982-08-18",
      salary: 69000,
      role: "Engineer",
      department: "Development",
    },
    {
      name: "Grace Blue",
      birthday: "1987-05-25",
      salary: 71000,
      role: "Product Manager",
      department: "Product",
    },
    {
      name: "Hank Gray",
      birthday: "1991-12-05",
      salary: 73000,
      role: "Recruiter",
      department: "HR",
    },
  ];

  for (const emp of sampleEmployees) {
    await createEmployee(emp);
  }

  console.log("✅ Seeded 10 employees into the database.");
}

// Run with: node db/employees.js seed
if (process.argv[2] === "seed") {
  seedEmployees()
    .catch(console.error)
    .finally(() => db.end());
}
