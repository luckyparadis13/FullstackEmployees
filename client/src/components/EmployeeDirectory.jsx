import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    salary: "",
    role: "",
    department: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/employees");
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/employees/${editingId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/employees", formData);
      }
      setFormData({
        name: "",
        birthday: "",
        salary: "",
        role: "",
        department: "",
      });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      console.error("Form submission failed:", err);
    }
  };

  const startEditing = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      birthday: employee.birthday,
      salary: employee.salary,
      role: employee.role,
      department: employee.department,
    });
  };

  const sortedFilteredEmployees = employees
    .filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.department?.toLowerCase().includes(search.toLowerCase()) ||
        e.role?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Employee Directory</h1>

      <form className="mb-6 border p-4 rounded" onSubmit={handleFormSubmit}>
        <h2 className="text-xl font-semibold mb-2">
          {editingId ? "Edit" : "Add"} Employee
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            className="border p-2"
            placeholder="Name"
            required
          />
          <input
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleFormChange}
            className="border p-2"
            required
          />
          <input
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleFormChange}
            className="border p-2"
            placeholder="Salary"
          />
          <input
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            className="border p-2"
            placeholder="Role"
          />
          <input
            name="department"
            value={formData.department}
            onChange={handleFormChange}
            className="border p-2"
            placeholder="Department"
          />
        </div>
        <button
          type="submit"
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"} Employee
        </button>
      </form>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Search by name, department, or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="department">Department</option>
          <option value="role">Role</option>
        </select>
      </div>

      {selectedEmployee ? (
        <div className="border rounded p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">
            {selectedEmployee.name}
          </h2>
          <p>
            <strong>Birthday:</strong> {selectedEmployee.birthday}
          </p>
          <p>
            <strong>Salary:</strong> ${selectedEmployee.salary}
          </p>
          <p>
            <strong>Role:</strong> {selectedEmployee.role}
          </p>
          <p>
            <strong>Department:</strong> {selectedEmployee.department}
          </p>
          <button
            className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => setSelectedEmployee(null)}
          >
            Back
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedFilteredEmployees.map((emp) => (
            <div key={emp.id} className="border p-4 rounded shadow">
              <h2 className="font-bold text-lg">{emp.name}</h2>
              <p className="text-sm">
                {emp.role} — {emp.department}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => setSelectedEmployee(emp)}
                >
                  View
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => startEditing(emp)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteEmployee(emp.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
