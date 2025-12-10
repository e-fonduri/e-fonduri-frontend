"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout(props: Props) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = (session as any)?.backendToken?.accessToken;

      if (!accessToken) {
        setError("No access token found");
        return;
      }

      const response = await fetch("http://localhost:3001/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>You're logged in and this is your email: {session?.user?.email}</div>

      <div className="mt-4">
        <button
          onClick={handleGetUserData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Get User Data (/users/me)"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {userData && (
        <div className="mt-4 p-4 bg-green-100 text-black rounded">
          <h3 className="font-bold mb-2">User Data:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}

      <div>{props.children}</div>
    </div>
  );
}
