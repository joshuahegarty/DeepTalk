"use client";

import { useWorkspace } from "@/lib/workspace-context";

export default function RecordPage() {
  const { workspace } = useWorkspace();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Record</h1>

      <div className="max-w-lg mx-auto text-center py-20">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
          <svg
            className="h-12 w-12 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
          </svg>
        </div>

        <h2 className="text-lg font-semibold mb-2">Ready to record</h2>
        <p className="text-gray-500 mb-8">
          {workspace
            ? `Recording to workspace: ${workspace.name}`
            : "Select a workspace first"}
        </p>

        <button
          disabled={!workspace}
          className="rounded-full bg-red-500 px-8 py-4 text-lg font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          Start Recording
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Recording and transcription coming soon
        </p>
      </div>
    </div>
  );
}
