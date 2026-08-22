import { motion } from "framer-motion";
import { useState } from "react";
import { Target, TrendingUp, AlertTriangle } from "lucide-react";

interface TopicData {
  topic: string;
  strength: number; // 0-100
  weakness: boolean;
  suggestion: string;
  color: string;
}

interface KnowledgeMapProps {
  topics: TopicData[];
  onTopicClick?: (topic: TopicData) => void;
  className?: string;
}

export function KnowledgeMap({ topics, onTopicClick, className = "" }: KnowledgeMapProps) {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const getStrengthColor = (strength: number) => {
    if (strength >= 85) return "#22c55e";
    if (strength >= 70) return "#84cc16";
    if (strength >= 55) return "#eab308";
    if (strength >= 40) return "#f97316";
    return "#ef4444";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 85) return "Dominado";
    if (strength >= 70) return "Fuerte";
    if (strength >= 55) return "En progreso";
    if (strength >= 40) return "En desarrollo";
    return "Necesita atención";
  };

  if (topics.length === 0) {
    return (
      <div className={`rounded-2xl border border-surface-100 bg-white dark:bg-white/5 p-8 text-center ${className}`}>
        <Target className="w-10 h-10 mx-auto text-surface-300 mb-3" />
        <p className="text-sm text-surface-500">Completa ejercicios para ver tu mapa de conocimiento</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-surface-100 bg-white dark:bg-white/5 overflow-hidden ${className}`}>
      <div className="px-5 pt-5 pb-3 border-b border-surface-100 dark:border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-primary-500" /> Mapa de Conocimiento
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Tu fortaleza por tema</p>
        </div>
        <div className="text-[10px] px-2.5 py-1 bg-surface-100 dark:bg-white/5 rounded-full text-surface-500 font-medium">
          {topics.length} temas
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((topic, index) => {
            const isHovered = hoveredTopic === topic.topic;
            const strengthColor = getStrengthColor(topic.strength);

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onTopicClick?.(topic)}
                onHoverStart={() => setHoveredTopic(topic.topic)}
                onHoverEnd={() => setHoveredTopic(null)}
                className="group relative bg-surface-50 dark:bg-white/5 rounded-xl p-4 border border-surface-100 dark:border-white/10 cursor-pointer overflow-hidden transition-all active:bg-surface-100 dark:active:bg-white/10"
              >
                {/* Strength bar background */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-200 dark:bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.strength}%` }}
                    transition={{ delay: index * 0.05, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full rounded-r-full"
                    style={{ backgroundColor: strengthColor }}
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: strengthColor }}
                      />
                      <span className="font-semibold text-sm text-surface-800 dark:text-white truncate pr-1">
                        {topic.topic}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="text-xl font-bold tabular-nums text-surface-900 dark:text-white">
                        {topic.strength}
                        <span className="text-xs font-medium text-surface-400 align-super ml-px">%</span>
                      </div>
                      <div 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${strengthColor}15`,
                          color: strengthColor 
                        }}
                      >
                        {getStrengthLabel(topic.strength)}
                      </div>
                    </div>

                    <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-1.5 line-clamp-2 leading-snug">
                      {topic.suggestion}
                    </p>
                  </div>

                  {topic.weakness && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${strengthColor}08 0%, transparent 70%)`
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-surface-100 dark:border-white/10 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-4 text-surface-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Dominado
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" /> En progreso
            </div>
          </div>
          <button 
            onClick={() => onTopicClick?.(topics[0])}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 text-xs"
          >
            Ver recomendaciones <TrendingUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
