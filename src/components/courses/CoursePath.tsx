import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LessonNode, NodeStatus } from "./LessonNode";
import type { LessonType } from "@/lib/courseData";

interface PathLesson {
  id: string;
  title: string;
  status: NodeStatus;
  lessonType?: LessonType;
  requiredLesson?: string;
  legendary?: boolean;
}

interface CoursePathProps {
  lessons: PathLesson[];
  onSelectLesson: (id: string) => void;
}

function getPathColor(status: NodeStatus): string {
  if (status === "completed" || status === "crowned") return "#34d399";
  if (status === "unlocked") return "#6366f1";
  return "#374151";
}

export function CoursePath({ lessons, onSelectLesson }: CoursePathProps) {
  const nodeWidth = 56;
  const nodeHeight = 56;
  const horizontalOffset = 72;
  const verticalGap = 96;

  const pathData = useMemo(() => {
    if (lessons.length < 2) return "";
    const points: { x: number; y: number }[] = [];
    lessons.forEach((_, i) => {
      const isEven = i % 2 === 0;
      const x = isEven ? 0 : horizontalOffset;
      const y = i * verticalGap;
      points.push({ x, y });
    });
    let d = "";
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midY = (p0.y + p1.y) / 2;
      const cp1x = p0.x + (p1.x - p0.x) * 0.3;
      const cp2x = p0.x + (p1.x - p0.x) * 0.7;
      d += `M ${p0.x + nodeWidth / 2} ${p0.y + nodeHeight}`;
      d += `C ${cp1x + nodeWidth / 2} ${midY}, ${cp2x + nodeWidth / 2} ${midY}, ${p1.x + nodeWidth / 2} ${p1.y}`;
    }
    return d;
  }, [lessons.length]);

  const totalLength = pathData ? 800 : 0;

  return (
    <div
      className="relative py-8"
      style={{ minHeight: `${Math.max(1, lessons.length) * verticalGap + 40}px` }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        {lessons.map((lesson, i) => {
          if (i === 0) return null;
          const isEven = i % 2 === 0;
          const x = isEven ? 0 : horizontalOffset;
          const y = i * verticalGap;
          const prevIsEven = (i - 1) % 2 === 0;
          const prevX = prevIsEven ? 0 : horizontalOffset;
          const prevY = (i - 1) * verticalGap;
          const midY = (prevY + y) / 2;
          const cp1x = prevX + (x - prevX) * 0.3;
          const cp2x = prevX + (x - prevX) * 0.7;

          const prevStatus = lessons[i - 1].status;
          const color = getPathColor(prevStatus);
          const isComplete = prevStatus === "completed" || prevStatus === "crowned";

          return (
            <g key={`path-${lesson.id}`}>
              {isComplete ? (
                <path
                  d={`M ${prevX + nodeWidth / 2} ${prevY + nodeHeight} C ${cp1x + nodeWidth / 2} ${midY}, ${cp2x + nodeWidth / 2} ${midY}, ${x + nodeWidth / 2} ${y}`}
                  stroke={color}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.6"
                  className="drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]"
                />
              ) : (
                <motion.path
                  d={`M ${prevX + nodeWidth / 2} ${prevY + nodeHeight} C ${cp1x + nodeWidth / 2} ${midY}, ${cp2x + nodeWidth / 2} ${midY}, ${x + nodeWidth / 2} ${y}`}
                  stroke={color}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                  opacity="0.4"
                  animate={{ strokeDashoffset: [0, -28] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
              {isComplete && (
                <motion.circle
                  cx={prevX + nodeWidth / 2}
                  cy={prevY + nodeHeight}
                  r="3"
                  fill={color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {lessons.map((lesson, i) => {
        const isEven = i % 2 === 0;
        return (
          <div
            key={lesson.id}
            className="absolute flex"
            style={{
              left: isEven ? "0px" : `${horizontalOffset}px`,
              top: `${i * verticalGap + 8}px`,
            }}
          >
            <LessonNode
              status={lesson.status}
              title={lesson.title}
              number={i + 1}
              lessonType={lesson.lessonType}
              requiredLesson={lesson.requiredLesson}
              legendary={lesson.legendary}
              onSelect={() => onSelectLesson(lesson.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
