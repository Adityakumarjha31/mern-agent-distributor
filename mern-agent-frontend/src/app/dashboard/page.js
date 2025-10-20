"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login"); // redirect if not logged in
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "2rem 3rem",
          maxWidth: "450px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
          ✅ Welcome to Admin Dashboard
        </h2>
        <p style={{ color: "#f0f0f0", marginBottom: "2rem" }}>
          Manage your agents and distribute contact lists easily.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Link
            href="/dashboard/agents"
            style={{
              textDecoration: "none",
              backgroundColor: "#fff",
              color: "#5563DE",
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            ➕ Manage Agents
          </Link>

          <Link
            href="/upload"
            style={{
              textDecoration: "none",
              backgroundColor: "#fff",
              color: "#5563DE",
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            📤 Upload & Distribute Lists
          </Link>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          style={{
            marginTop: "2rem",
            backgroundColor: "#FF5A5F",
            color: "#fff",
            border: "none",
            padding: "0.8rem 2rem",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e0484c")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#FF5A5F")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
