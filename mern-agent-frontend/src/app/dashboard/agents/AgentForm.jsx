"use client";
import { useState } from "react";
import axios from "axios";

export default function AgentForm({ onAgentAdded }) {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Basic validation
    if (!form.name || !form.email || !form.mobile || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/agents", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setForm({ name: "", email: "", mobile: "", password: "" });
      setMessage("Agent added successfully!");
      onAgentAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add agent");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Mobile (+91…)" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit" style={{ marginTop: "10px" }}>Add Agent</button>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
