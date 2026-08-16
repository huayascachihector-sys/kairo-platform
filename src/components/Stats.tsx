import { Users, Star, GraduationCap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Users,
    value: "25,000+",
    label: "Estudiantes activos",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Calificación promedio",
  },
  {
    icon: GraduationCap,
    value: "95%",
    label: "Tasa de aprobación",
  },
  {
    icon: Globe,
    value: "12",
    label: "Países con acceso",
  },
];

export function Stats() {
  return (
    <section className="relative z-10 -mt-12 mb-16 container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 rounded-2xl bg-white p-4 shadow-xl border border-slate-100">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</div>
            <div className="mt-1 text-sm font-medium text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
