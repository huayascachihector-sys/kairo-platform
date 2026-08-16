import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TimelineEvent, { type TimelineEventData } from './TimelineEvent';

interface TimelineViewProps {
  title: string;
  events: TimelineEventData[];
  onComplete: () => void;
}

export default function TimelineView({ title, events, onComplete }: TimelineViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewedEvents, setViewedEvents] = useState<Set<string>>(new Set());
  const [scrollPos, setScrollPos] = useState(0);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setViewedEvents((prev) => new Set(prev).add(id));
  };

  const allViewed = events.every((e) => viewedEvents.has(e.id));

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-xs text-surface-400 mt-0.5">
            Explora los eventos en orden cronológico
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-500">
          <span>{viewedEvents.size}/{events.length} vistos</span>
          <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(viewedEvents.size / events.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent" />

        <div className="space-y-1">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <TimelineEvent
                event={event}
                index={i}
                total={events.length}
                isSelected={selectedId === event.id}
                onSelect={() => handleSelect(event.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {allViewed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-xl font-semibold text-sm transition-all"
          >
            Completar módulo
          </button>
        </motion.div>
      )}
    </div>
  );
}
