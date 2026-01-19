"use client";

import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function ClientTest() {
  const supabase = createBrowserClient();
  const [result, setResult] = useState<{ data: any; error: any } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    const { data, error } = await supabase.from("posts").select("id").limit(1);
    setResult({ data, error });
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Browser Client Test</h2>
      <button
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
      >
        {loading ? "Testing..." : "Test Browser Client"}
      </button>
      {result && (
        <div>
          {result.error ? (
            <div className="text-red-600">
              <p className="font-semibold">Error:</p>
              <pre className="text-sm mt-1">{JSON.stringify(result.error, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-green-600">
              <p className="font-semibold">Success!</p>
              <p className="text-sm mt-1">
                Fetched {result.data?.length ?? 0} post(s)
              </p>
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
