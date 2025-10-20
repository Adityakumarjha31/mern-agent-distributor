import "./dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-wrapper">
      <header>Admin Dashboard</header>
      <main>{children}</main>
    </div>
  );
}
