"use client";

import { useWorkspace } from "@/lib/workspace-context";

export default function DashboardPage() {
  const { workspace } = useWorkspace();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {!workspace ? (
        <p className="text-gray-500">Select a workspace to view analytics.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Calls" value="—" />
          <StatCard label="Avg Score" value="—" />
          <StatCard label="Avg Duration" value="—" />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
