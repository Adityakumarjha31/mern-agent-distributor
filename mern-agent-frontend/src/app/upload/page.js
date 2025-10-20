"use client";
import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("⚠️ Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("✅ File uploaded and distributed successfully!");
      setFile(null);
    } catch {
      setMessage("❌ Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4ff, #e3e9ff)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "2.5rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "480px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", color: "#222" }}>📤 Upload & Distribute List</h2>

        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              padding: "0.8rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#fafafa",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.9rem",
              background: loading
                ? "linear-gradient(135deg, #a0a0a0, #c0c0c0)"
                : "linear-gradient(135deg, #0070f3, #0051c9)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "1.5rem",
              color: message.includes("✅")
                ? "green"
                : message.includes("⚠️")
                ? "#b38b00"
                : "red",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
