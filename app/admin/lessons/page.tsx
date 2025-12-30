"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Skill {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  skill_id: string;
  lesson_number: number;
  title: string;
  description: string | null;
  topic: string | null;
  difficulty: number;
  estimated_minutes: number;
  is_published: boolean;
  skill?: Skill;
}

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [lessonsRes, skillsRes] = await Promise.all([
        fetch("/api/admin/lessons"),
        fetch("/api/admin/skills"),
      ]);
      
      const lessonsData = await lessonsRes.json();
      const skillsData = await skillsRes.json();
      
      if (lessonsData.lessons) {
        setLessons(lessonsData.lessons);
      }
      if (skillsData.skills) {
        setSkills(skillsData.skills);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(lessonId: string) {
    if (!confirm("Weet je zeker dat je deze les wilt verwijderen?")) {
      return;
    }

    try {
      await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
      setLessons(lessons.filter(l => l.id !== lessonId));
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  }

  async function togglePublish(lesson: Lesson) {
    try {
      await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !lesson.is_published }),
      });
      setLessons(lessons.map(l => 
        l.id === lesson.id ? { ...l, is_published: !l.is_published } : l
      ));
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  }

  const filteredLessons = selectedSkill
    ? lessons.filter(l => l.skill_id === selectedSkill)
    : lessons;

  // Group lessons by skill
  const lessonsBySkill = filteredLessons.reduce((acc, lesson) => {
    const skillId = lesson.skill_id;
    if (!acc[skillId]) {
      acc[skillId] = [];
    }
    acc[skillId].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link href="/admin" className="hover:text-blue-600">Admin</Link>
              <span>/</span>
              <span>Lessen</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Lessen Beheren</h1>
          </div>
          <Link href="/admin/lessons/new">
            <Button>+ Nieuwe Les</Button>
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">Alle vaardigheden</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>{skill.title}</option>
            ))}
          </select>
        </div>

        {/* Lessons List */}
        {Object.keys(lessonsBySkill).length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            Nog geen lessen. {skills.length === 0 ? "Maak eerst een vaardigheid aan." : "Maak een les aan om te beginnen."}
          </Card>
        ) : (
          Object.entries(lessonsBySkill).map(([skillId, skillLessons]) => {
            const skill = skills.find(s => s.id === skillId);
            return (
              <div key={skillId} className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {skill?.title || skillId}
                  <span className="text-sm font-normal text-gray-500">
                    ({skillLessons.length} lessen)
                  </span>
                </h2>
                <div className="space-y-3">
                  {skillLessons.sort((a, b) => a.lesson_number - b.lesson_number).map((lesson) => (
                    <Card key={lesson.id} className={`p-4 ${!lesson.is_published ? "opacity-60 border-dashed" : ""}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                          {lesson.lesson_number}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{lesson.title}</h3>
                            <span className="text-sm text-gray-500">({lesson.id})</span>
                            {!lesson.is_published && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                Concept
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{lesson.description || "Geen beschrijving"}</p>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span>Topic: {lesson.topic || "-"}</span>
                            <span>~{lesson.estimated_minutes} min</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/lessons/${lesson.id}`}>
                            <Button size="sm" variant="outline">Bewerken</Button>
                          </Link>
                          <Button size="sm" variant="outline" onClick={() => togglePublish(lesson)}>
                            {lesson.is_published ? "Verbergen" : "Publiceren"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(lesson.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
