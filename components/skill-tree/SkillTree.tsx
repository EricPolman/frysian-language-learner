"use client";

import { SkillNode } from "./SkillNode";

interface LessonInfo {
  id: string;
  title: string;
  description: string;
  topic: string;
}

interface Skill {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: string;
  order: number;
  lessons: LessonInfo[] | string[];
  prerequisites: string[];
  color: string;
}

interface UserProgress {
  completedLessons: Set<string>;
  currentSkill?: string;
}

interface SkillTreeProps {
  skills: Skill[];
  userProgress: UserProgress;
}

// Helper to get lesson ID from lesson info or string
function getLessonId(lesson: LessonInfo | string): string {
  return typeof lesson === 'string' ? lesson : lesson.id;
}

export function SkillTree({ skills, userProgress }: SkillTreeProps) {
  const { completedLessons, currentSkill } = userProgress;

  // Determine which skills are unlocked
  const unlockedSkills = new Set<string>();
  
  skills.forEach((skill) => {
    // Check if all prerequisites are completed
    const prereqsMet = skill.prerequisites.every((prereqId) => {
      const prereqSkill = skills.find((s) => s.id === prereqId);
      if (!prereqSkill) return false;
      
      // A skill is completed if all its lessons are completed
      return prereqSkill.lessons.every((lesson) =>
        completedLessons.has(getLessonId(lesson))
      );
    });

    if (prereqsMet || skill.prerequisites.length === 0) {
      unlockedSkills.add(skill.id);
    }
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Skill nodes in responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {skills
          .sort((a, b) => a.order - b.order)
          .map((skill, index) => {
            const lessonsCompleted = skill.lessons.filter((lesson) =>
              completedLessons.has(getLessonId(lesson))
            ).length;
            
            const isLocked = !unlockedSkills.has(skill.id);
            const isActive = skill.id === currentSkill;

            return (
              <div 
                key={skill.id} 
                className="animate-fadeIn" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SkillNode
                  id={skill.id}
                  title={skill.title}
                  description={skill.description}
                  longDescription={skill.longDescription}
                  icon={skill.icon}
                  color={skill.color}
                  lessonsCompleted={lessonsCompleted}
                  totalLessons={skill.lessons.length}
                  isLocked={isLocked}
                  isActive={isActive}
                />
              </div>
            );
          })}
      </div>
      <div className="my-10 bg-white/70 backdrop-blur-xl rounded-2xl p-4 md:p-5 shadow-xl border border-white/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-center md:justify-start gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform">
              <div className="text-2xl font-bold">{completedLessons.size}</div>
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lessen</div>
              <div className="text-base font-bold text-gray-800">Voltooid</div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 group">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform">
              <div className="text-2xl font-bold">{unlockedSkills.size}</div>
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills</div>
              <div className="text-base font-bold text-gray-800">Ontgrendeld</div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 group">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform">
              <div className="text-2xl font-bold">{skills.length}</div>
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Totaal</div>
              <div className="text-base font-bold text-gray-800">Skills</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
