import { motion } from "framer-motion";

export default function StatusCard({
  title,
  value,
  status,
  icon,
  color
}) {
  return (

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl"
    >

      <div className={`${color}`}>
        {icon}
      </div>

      <h2 className="text-2xl mt-4 font-bold">
        {title}
      </h2>

      <p className={`mt-2 text-lg ${color}`}>
        {value}
      </p>

      <p className="text-zinc-500 mt-1">
        {status}
      </p>

    </motion.div>
  );
}