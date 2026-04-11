import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async () => {
  return new Response(JSON.stringify({ message: "Hello from DeepTalk!" }), {
    headers: { "Content-Type": "application/json" },
  });
});
