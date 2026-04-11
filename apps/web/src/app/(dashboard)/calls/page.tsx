"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useWorkspace } from "@/lib/workspace-context";
import type { Tables } from "@deeptalk/database";

type Call = Tables<"calls">;

export default function CallsPage() {
  const { workspace, loading: wsLoading } = useWorkspace();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!workspace) return;

    async function fetchCalls() {
      const { data } = await supabase
        .from("calls")
        .select("*")
        .eq("workspace_id", workspace!.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setCalls(data ?? []);
      setLoading(false);
    }

    fetchCalls();
  }, [workspace]);

  if (wsLoading || loading) {
    return <LoadingSkeleton />;
  }

  if (!workspace) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>No workspace selected.</p>
        <a href="/workspaces" className="text-indigo-600 hover:underline mt-2 inline-block">
          Select a workspace
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Calls</h1>
        <a
          href="/record"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Recording
        </a>
      </div>

      {calls.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No calls yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start recording to see calls appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Sentiment</th>
                <th className="px-6 py-3 font-medium">Score</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{call.title ?? "Untitled"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{call.call_type ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {call.duration ? formatDuration(call.duration) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {call.sentiment && (
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${sentimentColor(call.sentiment)}`}>
                        {call.sentiment}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{call.score ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(call.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function sentimentColor(sentiment: string) {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "bg-green-100 text-green-700";
    case "negative":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
