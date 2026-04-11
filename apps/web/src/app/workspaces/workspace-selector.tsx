"use client";

import { useRouter } from "next/navigation";
import type { Tables } from "@deeptalk/database";

type Workspace = Tables<"workspaces">;

export function WorkspaceSelector({ workspaces }: { workspaces: Workspace[] }) {
  const router = useRouter();

  function selectWorkspace(ws: Workspace) {
    localStorage.setItem("deeptalk_workspace_id", ws.id);
    router.push("/calls");
  }

  if (workspaces.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No workspaces found.</p>
        <p className="text-sm mt-2">Ask an admin to invite you to a workspace.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workspaces.map((ws) => (
        <button
          key={ws.id}
          onClick={() => selectWorkspace(ws)}
          className="w-full text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
        >
          <p className="font-medium">{ws.name}</p>
          <p className="text-sm text-gray-500">{ws.slug}</p>
        </button>
      ))}
    </div>
  );
}
