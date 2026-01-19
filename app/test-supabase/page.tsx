import { createClient as createServerClient } from "@/lib/supabase/server";
import ClientTest from "./client-test";

async function ServerTest() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("posts").select("id").limit(1);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Server Client Test</h2>
      {error ? (
        <div className="text-red-600">
          <p className="font-semibold">Error:</p>
          <pre className="text-sm mt-1">{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <div className="text-green-600">
          <p className="font-semibold">Success!</p>
          <p className="text-sm mt-1">
            Fetched {data?.length ?? 0} post(s)
          </p>
          <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function TestSupabasePage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Supabase Client Test</h1>
      <div className="space-y-6">
        <ServerTest />
        <ClientTest />
      </div>
    </div>
  );
}
