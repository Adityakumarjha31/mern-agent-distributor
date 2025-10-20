"use client";

export default function AgentList({ agents }) {
  if (!agents?.length) return <p>No agents found.</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((a) => (
          <tr key={a._id}>
            <td>{a.name}</td>
            <td>{a.email}</td>
            <td>{a.mobile}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
