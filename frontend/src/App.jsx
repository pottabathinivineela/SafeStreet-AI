import { motion } from "framer-motion";
import {
  ShieldAlert,
  Mic,
  Camera,
  MapPinned,
  Siren,
  Activity
} from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >

        <div>
          <h1 className="text-5xl font-bold text-red-500">
            SafeStreet AI
          </h1>

          <p className="text-zinc-400 mt-2">
            Intelligent Emergency Monitoring System
          </p>
        </div>

        <div className="bg-red-600 px-4 py-2 rounded-full animate-pulse">
          LIVE SYSTEM
        </div>

      </motion.div>

      {/* ALERT BANNER */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-red-900 to-red-600 p-6 rounded-3xl mt-8 shadow-2xl border border-red-500"
      >

        <div className="flex items-center gap-4">

          <ShieldAlert size={50} />

          <div>
            <h2 className="text-3xl font-bold">
              ⚠ Emergency Threat Detected
            </h2>

            <p className="text-red-100 mt-2">
              Audio distress keyword identified near Hyderabad Central Zone
            </p>
          </div>

        </div>

      </motion.div>

      {/* STATUS CARDS */}

      <div className="grid md:grid-cols-4 gap-6 mt-10">

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl"
        >
          <Mic className="text-green-400" size={40} />

          <h2 className="text-2xl mt-4 font-bold">
            Microphone
          </h2>

          <p className="text-green-400 mt-2">
            ACTIVE
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl"
        >
          <Camera className="text-blue-400" size={40} />

          <h2 className="text-2xl mt-4 font-bold">
            Camera AI
          </h2>

          <p className="text-blue-400 mt-2">
            Monitoring
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl"
        >
          <MapPinned className="text-yellow-400" size={40} />

          <h2 className="text-2xl mt-4 font-bold">
            GPS Tracking
          </h2>

          <p className="text-yellow-400 mt-2">
            Enabled
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl"
        >
          <Siren className="text-red-400" size={40} />

          <h2 className="text-2xl mt-4 font-bold">
            Threat Level
          </h2>

          <p className="text-red-400 mt-2">
            HIGH
          </p>
        </motion.div>

      </div>

      {/* LIVE ANALYTICS */}

      <div className="grid md:grid-cols-2 gap-6 mt-10">

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800"
        >

          <div className="flex items-center gap-3">
            <Activity className="text-red-500" />
            <h2 className="text-2xl font-bold">
              Live Incident Analytics
            </h2>
          </div>

          <div className="mt-6 space-y-4">

            <div>
              <div className="flex justify-between">
                <p>Audio Threat Confidence</p>
                <p>92%</p>
              </div>

              <div className="w-full bg-zinc-700 h-3 rounded-full mt-2">
                <div className="bg-red-500 h-3 rounded-full w-[92%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <p>Visual Threat Score</p>
                <p>78%</p>
              </div>

              <div className="w-full bg-zinc-700 h-3 rounded-full mt-2">
                <div className="bg-yellow-500 h-3 rounded-full w-[78%]"></div>
              </div>
            </div>

          </div>

        </motion.div>

        {/* SYSTEM LOGS */}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800"
        >

          <h2 className="text-2xl font-bold">
            Recent Alerts
          </h2>

          <div className="mt-6 space-y-4">

            <div className="bg-black p-4 rounded-xl border border-red-500">
              ⚠ Distress voice detected — 2 mins ago
            </div>

            <div className="bg-black p-4 rounded-xl border border-yellow-500">
              ⚠ Suspicious image uploaded — 10 mins ago
            </div>

            <div className="bg-black p-4 rounded-xl border border-green-500">
              ✔ System monitoring active
            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}

export default App;