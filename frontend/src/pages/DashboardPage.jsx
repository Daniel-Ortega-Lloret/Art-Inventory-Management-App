import { useAuth } from "../context/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="card">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}.</p>
        <p>This staff portal is used to manage artwork inventory.</p>
      </div>
    </div>
  );
}