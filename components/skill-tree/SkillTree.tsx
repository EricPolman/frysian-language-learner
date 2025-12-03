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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Jouw Leerpad
        </h1>
        <p className="text-gray-600">
          Voltooi vaardigheden in volgorde om nieuwe inhoud te ontgrendelen
        </p>
      </div>

      {/* Skill nodes */}
      <div className="space-y-4">
        {skills
          .sort((a, b) => a.order - b.order)
          .map((skill) => {
            const lessonsCompleted = skill.lessons.filter((lesson) =>
              completedLessons.has(getLessonId(lesson))
            ).length;
            
            const isLocked = !unlockedSkills.has(skill.id);
            const isActive = skill.id === currentSkill;

            return (
              <div key={skill.id} className="relative">
                {/* Connector line */}
                {skill.order > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-0.5 h-4 bg-gray-300" />
                )}
                
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

      {/* Stats footer */}
      <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {completedLessons.size}
            </div>
            <div className="text-sm text-gray-600">Lessen Voltooid</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {unlockedSkills.size}
            </div>
            <div className="text-sm text-gray-600">Vaardigheden Ontgrendeld</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {skills.length}
            </div>
            <div className="text-sm text-gray-600">Totaal Vaardigheden</div>
          </div>
        </div>
      </div>
    </div>
  );
}
