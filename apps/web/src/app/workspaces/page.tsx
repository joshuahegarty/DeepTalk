import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WorkspaceSelector } from "./workspace-selector";

export default async function WorkspacesPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: workspaces } = await supabase.from("workspaces").select("*");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Select a workspace</h1>
          <p className="mt-1 text-gray-600">Choose a workspace to continue</p>
        </div>

        <WorkspaceSelector workspaces={workspaces ?? []} />
      </div>
    </div>
  );
}
