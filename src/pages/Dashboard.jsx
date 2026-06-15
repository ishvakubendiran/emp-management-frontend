import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", department: "", salary: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees", authHeader);
      setEmployees(res.data);
    } catch (err) {
      alert("Failed to fetch employees: " + err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, form, authHeader);
        setEditingId(null);
      } else {
        await api.post("/employees", form, authHeader);
      }
      setForm({ firstname: "", lastname: "", email: "", department: "", salary: "" });
      fetchEmployees();
    } catch (err) {
      alert("Operation failed: " + err.message);
    }
  };

  const handleEdit = (emp) => {
    setForm({ firstname: emp.firstname, lastname: emp.lastname, email: emp.email, department: emp.department, salary: emp.salary });
    setEditingId(emp.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`, authHeader);
      fetchEmployees();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="flex justify-between items-center mb-6 bg-indigo-600 text-white p-5 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-lg mb-6 grid grid-cols-2 md:grid-cols-5 gap-3 border border-gray-200">
        <input name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        <input name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        <input name="salary" placeholder="Salary" type="number" value={form.salary} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        <button type="submit" className="col-span-2 md:col-span-5 bg-green-600 text-white p-2.5 rounded-lg font-semibold hover:bg-green-700 transition">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-indigo-600 text-white text-left">
              <th className="p-3">ID</th>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3">Salary</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t even:bg-gray-50 hover:bg-indigo-50 transition">
                <td className="p-3">{emp.id}</td>
                <td className="p-3">{emp.firstname}</td>
                <td className="p-3">{emp.lastname}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3">{emp.salary}</td>
                <td className="p-3">
                  <button onClick={() => handleEdit(emp)} className="bg-yellow-500 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-yellow-600 transition">Edit</button>
                  <button onClick={() => handleDelete(emp.id)} className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;