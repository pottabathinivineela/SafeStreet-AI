import StatusCard from "../components/StatusCard";
import Sidebar from "../components/Sidebar";
import {
  Mic,
  Camera,
  MapPinned,
  ShieldAlert
} from "lucide-react";

export default function Dashboard() {

  return (

    <div className="min-h-screen bg-black text-white flex">
        <Sidebar />
        <div className="flex-1 p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold text-red-500">
            SafeStreet AI
          </h1>

          <p className="text-zinc-400 mt-2">
            AI Emergency Monitoring Dashboard
          </p>

        </div>

        <div className="bg-red-600 px-5 py-2 rounded-full animate-pulse">
          LIVE SYSTEM
        </div>

      </div>

      {/* ALERT BANNER */}

      <div className="mt-8 bg-gradient-to-r from-red-900 to-red-600 p-6 rounded-3xl border border-red-500 shadow-2xl">

        <div className="flex items-center gap-4">

          <ShieldAlert size={50} />

          <div>

            <h2 className="text-3xl font-bold">
              Emergency Alert Detected
            </h2>

            <p className="text-red-100 mt-2">
              Distress keyword identified near Hyderabad
            </p>

          </div>

        </div>

      </div>

      {/* STATUS GRID */}

      <div className="grid md:grid-cols-4 gap-6 mt-10">

        <StatusCard
          title="Microphone"
          value="ACTIVE"
          status="Audio monitoring enabled"
          icon={<Mic size={40} />}
          color="text-green-400"
        />

        <StatusCard
          title="Camera AI"
          value="MONITORING"
          status="Visual detection running"
          icon={<Camera size={40} />}
          color="text-blue-400"
        />

        <StatusCard
          title="GPS Tracking"
          value="CONNECTED"
          status="Live location enabled"
          icon={<MapPinned size={40} />}
          color="text-yellow-400"
        />

        <StatusCard
          title="Threat Level"
          value="HIGH"
          status="Immediate attention required"
          icon={<ShieldAlert size={40} />}
          color="text-red-400"
        />

      </div>

    </div>
    </div>
  );
}