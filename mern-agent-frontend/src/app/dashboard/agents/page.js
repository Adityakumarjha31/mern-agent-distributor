"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all agents
  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/agents");
      setAgents(res.data);
    } catch {
      setError("Failed to load agents");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update Agent
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/agents/${editingId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/agents", form);
      }
      setForm({ name: "", email: "", phone: "", password: "" });
      setEditingId(null);
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Agent
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/agents/${id}`);
      fetchAgents();
    } catch {
      setError("Failed to delete agent");
    }
  };

  // ✅ Edit Agent
  const handleEdit = (agent) => {
    setForm({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      password: "",
    });
    setEditingId(agent._id);
  };

  return (
    <div className="container" style={{ maxWidth: "600px", margin: "auto", textAlign: "center", padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>👥 Manage Agents</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Mobile (+91…)" value={form.phone} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required={!editingId} />
        <button
          type="submit"
          style={{
            backgroundColor: "#0070f3",
            color: "white",
            padding: "0.7rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Saving..." : editingId ? "Update Agent" : "Add Agent"}
        </button>
      </form>

      <table style={{ width: "100%", marginTop: "2rem", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: "0.6rem" }}>Name</th>
            <th style={{ padding: "0.6rem" }}>Email</th>
            <th style={{ padding: "0.6rem" }}>Mobile</th>
            <th style={{ padding: "0.6rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.phone}</td>
              <td>
                <button
                  onClick={() => handleEdit(agent)}
                  style={{
                    marginRight: "0.5rem",
                    background: "#ffa500",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(agent._id)}
                  style={{
                    background: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {agents.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: "1rem" }}>
                No agents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
