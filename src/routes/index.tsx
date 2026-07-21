import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  component: () => (
    <div className="p-8 text-center">
      <Link to="/dashboard" className="gradient-text text-xl font-bold">Go to Dashboard</Link>
    </div>
  ),
});
