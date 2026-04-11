"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@deeptalk/database";

type Workspace = Tables<"workspaces">;

interface WorkspaceContextValue {
  workspace: Workspace | null;
  setWorkspace: (ws: Workspace) => void;
  workspaces: Workspace[];
  loading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspace: null,
  setWorkspace: () => {},
  workspaces: [],
  loading: true,
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspaceState] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("workspaces").select("*");
      const workspaceRows = (data ?? []) as Workspace[];
      if (workspaceRows.length > 0) {
        setWorkspaces(workspaceRows);
        const saved = localStorage.getItem("deeptalk_workspace_id");
        const found = workspaceRows.find((w) => w.id === saved);
        if (found) setWorkspaceState(found);
      }
      setLoading(false);
    }
    load();
  }, []);

  function setWorkspace(ws: Workspace) {
    setWorkspaceState(ws);
    localStorage.setItem("deeptalk_workspace_id", ws.id);
  }

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace, workspaces, loading }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
