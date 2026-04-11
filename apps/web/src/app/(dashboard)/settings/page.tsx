"use client";

import { useWorkspace } from "@/lib/workspace-context";

export default function SettingsPage() {
  const { workspace } = useWorkspace();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {!workspace ? (
        <p className="text-gray-500">Select a workspace to manage settings.</p>
      ) : (
        <div className="max-w-2xl space-y-8">
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold mb-4">Workspace</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">{workspace.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <p className="mt-1 text-gray-900">{workspace.slug}</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold mb-4">Integrations</h2>
            <p className="text-sm text-gray-500">CRM integrations coming soon.</p>
          </section>
        </div>
      )}
    </div>
  );
}
