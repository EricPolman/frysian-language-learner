"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SkillNodeProps {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
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
  longDescription,
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
        relative overflow-hidden transition-all duration-300 h-full
        ${isLocked 
          ? "opacity-70 cursor-not-allowed bg-gray-50/80 backdrop-blur-sm" 
          : "hover:shadow-2xl hover:-translate-y-2 bg-white/90 backdrop-blur-lg cursor-pointer"}
        ${isActive ? "ring-4 ring-blue-500 shadow-2xl -translate-y-1" : "shadow-lg"}
        ${isCompleted ? "bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-400/50" : "border-gray-200/50"}
      `}
    >
      {/* Decorative gradient bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1">
        <div 
          className="h-2 flex-1"
          style={{
            background: isLocked 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
              : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          }}
        />
        {isCompleted && (
          <div className="h-2 w-16 bg-gradient-to-r from-green-400 to-emerald-500" />
        )}
      </div>

      {/* Lock overlay with improved design */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-lg z-10">
          <div className="text-center px-3">
            <div className="text-4xl mb-2 animate-pulse">🔒</div>
            <p className="text-xs font-bold text-gray-700">Voltooi eerst eerdere skills</p>
          </div>
        </div>
      )}

      {/* Completion badge */}
      {isCompleted && !isLocked && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full p-2 shadow-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      <div className="p-4 pt-6">
        {/* Icon with gradient background */}
        <div className="mb-5 flex flex-row items-center gap-4">
          <div 
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center text-4xl shadow-lg transform hover:scale-110 transition-transform"
            style={{
              background: isLocked 
                ? 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)' 
                : `linear-gradient(135deg, ${color}15 0%, ${color}35 100%)`,
              border: isLocked ? 'none' : `3px solid ${color}30`,
            }}
          >
            {icon}
          </div>
          <div>

          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-600 leading-snug">{description}</p>
          </div>

          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Progress with improved styling */}
          <div className="space-y-2 pt-1">
            <div className="relative">
              <Progress value={progress} className="h-3 shadow-inner" />
              {!isLocked && progress > 0 && (
                <div 
                  className="absolute top-0 left-0 h-3 rounded-full opacity-30 blur-sm"
                  style={{ 
                    background: color,
                    width: `${progress}%`,
                  }}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">
                {lessonsCompleted} / {totalLessons} lessen
              </span>
              {isCompleted ? (
                <span className="text-xs text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                  <span className="text-sm">✓</span> Voltooid
                </span>
              ) : (
                <span 
                  className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{ 
                    color: isLocked ? '#9ca3af' : color,
                    backgroundColor: isLocked ? '#f3f4f6' : `${color}15`,
                  }}
                >
                  {Math.round(progress)}%
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
    <Link href={`/learn/skill/${id}`} className="block group">
      {content}
    </Link>
  );
}
