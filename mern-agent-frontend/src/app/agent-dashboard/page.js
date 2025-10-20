"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem("agentToken");
      if (!token) {
        router.push("/agent-login"); // redirect to login if no token
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/agents/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setLeads(data); // backend returns array of ListItem
        } else {
          setError(data.message || "Failed to fetch leads");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [router]);

  if (loading) return <p>Loading leads...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
      <h2>My Leads</h2>
      {leads.length === 0 ? (
        <p>No leads assigned yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>First Name</th>
              <th>Phone</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <tr key={idx}>
                <td>{lead.firstName}</td>
                <td>{lead.phone}</td>
                <td>{lead.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
