import {
  LayoutDashboard,
  Bell,
  Upload,
  ShieldAlert,
  Activity
} from "lucide-react";

export default function Sidebar() {

  return (

    <div className="w-72 bg-zinc-950 border-r border-zinc-800 min-h-screen p-6">

      {/* LOGO */}

      <div className="mb-10">

        <h1 className="text-3xl font-bold text-red-500">
          SafeStreet AI
        </h1>

        <p className="text-zinc-500 mt-2">
          Emergency Intelligence System
        </p>

      </div>

      {/* NAVIGATION */}

      <div className="space-y-4">

        <div className="flex items-center gap-4 bg-red-600 p-4 rounded-2xl cursor-pointer">

          <LayoutDashboard />

          <p className="font-semibold">
            Dashboard
          </p>

        </div>

        <div className="flex items-center gap-4 hover:bg-zinc-900 p-4 rounded-2xl cursor-pointer transition">

          <Bell />

          <p>
            Alerts
          </p>

        </div>

        <div className="flex items-center gap-4 hover:bg-zinc-900 p-4 rounded-2xl cursor-pointer transition">

          <Upload />

          <p>
            Upload Evidence
          </p>

        </div>

        <div className="flex items-center gap-4 hover:bg-zinc-900 p-4 rounded-2xl cursor-pointer transition">

          <ShieldAlert />

          <p>
            Threat Reports
          </p>

        </div>

      </div>

      {/* SYSTEM STATUS */}

      <div className="mt-16 bg-zinc-900 p-5 rounded-3xl border border-zinc-800">

        <div className="flex items-center gap-3">

          <Activity className="text-green-400" />

          <h2 className="font-bold">
            System Status
          </h2>

        </div>

        <div className="mt-4">

          <div className="flex justify-between">
            <p className="text-zinc-400">
              Monitoring
            </p>

            <p className="text-green-400">
              ACTIVE
            </p>
          </div>

          <div className="flex justify-between mt-3">
            <p className="text-zinc-400">
              AI Engine
            </p>

            <p className="text-blue-400">
              ONLINE
            </p>
          </div>

        </div>

      </div>

    </div>

  );
}