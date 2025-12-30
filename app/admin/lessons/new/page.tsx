"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Skill {
  id: string;
  title: string;
}

export default function NewLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedSkillId = searchParams.get("skillId") || "";

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    skillId: preSelectedSkillId,
    lessonNumber: 1,
    title: "",
    description: "",
    topic: "",
    difficulty: 1,
    estimatedMinutes: 10,
    isPublished: false,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (preSelectedSkillId) {
      setFormData(prev => ({ ...prev, skillId: preSelectedSkillId }));
      fetchNextLessonNumber(preSelectedSkillId);
    }
  }, [preSelectedSkillId]);

  async function fetchSkills() {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (data.skills) {
        setSkills(data.skills);
        if (!preSelectedSkillId && data.skills.length > 0) {
          setFormData(prev => ({ ...prev, skillId: data.skills[0].id }));
          fetchNextLessonNumber(data.skills[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchNextLessonNumber(skillId: string) {
    try {
      const res = await fetch(`/api/admin/lessons?skillId=${skillId}`);
      const data = await res.json();
      if (data.lessons) {
        const maxNumber = data.lessons.reduce((max: number, l: any) => Math.max(max, l.lesson_number), 0);
        setFormData(prev => ({ ...prev, lessonNumber: maxNumber + 1 }));
      }
    } catch (error) {
      console.error("Error fetching lesson numbers:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/lessons/${data.lesson.id}`);
      } else {
        const error = await res.json();
        alert(`Fout: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Laden...</div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Geen vaardigheden</h2>
            <p className="text-gray-600 mb-4">
              Je moet eerst een vaardigheid aanmaken voordat je lessen kunt toevoegen.
            </p>
            <Link href="/admin/skills">
              <Button>Ga naar Vaardigheden →</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/admin" className="hover:text-blue-600">Admin</Link>
          <span>/</span>
          <Link href="/admin/lessons" className="hover:text-blue-600">Lessen</Link>
          <span>/</span>
          <span>Nieuw</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nieuwe Les</h1>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="skillId">Vaardigheid</Label>
              <select
                id="skillId"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.skillId}
                onChange={(e) => {
                  setFormData({ ...formData, skillId: e.target.value });
                  fetchNextLessonNumber(e.target.value);
                }}
                required
              >
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>{skill.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lessonNumber">Lesnummer</Label>
                <Input
                  id="lessonNumber"
                  type="number"
                  min={1}
                  value={formData.lessonNumber}
                  onChange={(e) => setFormData({ ...formData, lessonNumber: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={`Les ${formData.lessonNumber}`}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Beschrijving</Label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Wat leert de gebruiker in deze les?"
              />
            </div>

            <div>
              <Label htmlFor="topic">Onderwerp</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="bijv. begroetingen, getallen, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty">Moeilijkheid (1-5)</Label>
                <Input
                  id="difficulty"
                  type="number"
                  min={1}
                  max={5}
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="estimatedMinutes">Geschatte tijd (minuten)</Label>
                <Input
                  id="estimatedMinutes"
                  type="number"
                  min={1}
                  value={formData.estimatedMinutes}
                  onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              <Label htmlFor="isPublished">Direct publiceren</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Opslaan..." : "Les Aanmaken"}
              </Button>
              <Link href="/admin/lessons">
                <Button type="button" variant="outline">Annuleren</Button>
              </Link>
            </div>
          </form>
        </Card>

        <p className="text-sm text-gray-500 mt-4">
          Na het aanmaken kun je introkaarten en oefeningen toevoegen.
        </p>
      </div>
    </div>
  );
}
