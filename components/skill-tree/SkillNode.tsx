"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SkillNodeProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessonsCompleted: number;
  totalLessons: number;
  isLocked: boolean;
  isActive: boolean;
}

export function SkillNode({
  id,
  title,
  description,
  icon,
  color,
  lessonsCompleted,
  totalLessons,
  isLocked,
  isActive,
}: SkillNodeProps) {
  const progress = (lessonsCompleted / totalLessons) * 100;
  const isCompleted = lessonsCompleted === totalLessons;

  const content = (
    <Card
      className={`
        relative p-6 transition-all duration-200 cursor-pointer
        ${isLocked ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:scale-105"}
        ${isActive ? "ring-2 ring-blue-500 shadow-lg" : ""}
        ${isCompleted ? "bg-green-50 border-green-200" : ""}
      `}
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: isLocked ? "#9ca3af" : color,
      }}
    >
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl shrink-0">{icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>

          {/* Progress */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                {lessonsCompleted} / {totalLessons} lessen
              </span>
              {isCompleted && (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span>✓</span> Voltooid
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLocked) {
    return <div className="relative">{content}</div>;
  }

  return (
    <Link href={`/learn/skill/${id}`} className="block">
      {content}
    </Link>
  );
}
