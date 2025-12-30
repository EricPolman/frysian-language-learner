"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Skill {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  icon: string;
  order: number;
  difficulty: number;
  prerequisites: string[];
  color: string;
  is_published: boolean;
  lessons?: {
    id: string;
    title: string;
    lesson_number: number;
    is_published: boolean;
  }[];
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    longDescription: "",
    icon: "📚",
    order: 0,
    difficulty: 1,
    prerequisites: "",
    color: "#3b82f6",
    isPublished: false,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (data.skills) {
        setSkills(data.skills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      id: "",
      title: "",
      description: "",
      longDescription: "",
      icon: "📚",
      order: skills.length,
      difficulty: 1,
      prerequisites: "",
      color: "#3b82f6",
      isPublished: false,
    });
    setEditingSkill(null);
  }

  function startEdit(skill: Skill) {
    setFormData({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      longDescription: skill.long_description || "",
      icon: skill.icon,
      order: skill.order,
      difficulty: skill.difficulty,
      prerequisites: skill.prerequisites.join(", "),
      color: skill.color,
      isPublished: skill.is_published,
    });
    setEditingSkill(skill);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const payload = {
      ...formData,
      prerequisites: formData.prerequisites
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    };

    try {
      if (editingSkill) {
        await fetch(`/api/admin/skills/${editingSkill.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      
      await fetchSkills();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  }

  async function handleDelete(skillId: string) {
    if (!confirm("Weet je zeker dat je deze vaardigheid wilt verwijderen? Dit verwijdert ook alle lessen.")) {
      return;
    }

    try {
      await fetch(`/api/admin/skills/${skillId}`, { method: "DELETE" });
      await fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  }

  async function togglePublish(skill: Skill) {
    try {
      await fetch(`/api/admin/skills/${skill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !skill.is_published }),
      });
      await fetchSkills();
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  }

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
              <span>Vaardigheden</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Vaardigheden Beheren</h1>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            + Nieuwe Vaardigheid
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingSkill ? "Vaardigheid Bewerken" : "Nieuwe Vaardigheid"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="id">ID (uniek, geen spaties)</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                    placeholder="bijv. basics-1"
                    disabled={!!editingSkill}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Basis 1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Korte Beschrijving</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Essentiële woorden en begroetingen"
                  required
                />
              </div>

              <div>
                <Label htmlFor="longDescription">Lange Beschrijving</Label>
                <textarea
                  id="longDescription"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  placeholder="Uitgebreide beschrijving van wat de leerling gaat leren..."
                />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="icon">Icoon (emoji)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="order">Volgorde</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
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
                  <Label htmlFor="color">Kleur</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prerequisites">Vereisten (komma-gescheiden IDs)</Label>
                <Input
                  id="prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  placeholder="basics-1, basics-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <Label htmlFor="isPublished">Gepubliceerd (zichtbaar voor gebruikers)</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingSkill ? "Opslaan" : "Aanmaken"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                  Annuleren
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Skills List */}
        <div className="space-y-4">
          {skills.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              Nog geen vaardigheden. Maak er een aan om te beginnen.
            </Card>
          ) : (
            skills.sort((a, b) => a.order - b.order).map((skill) => (
              <Card key={skill.id} className={`p-6 ${!skill.is_published ? "opacity-60 border-dashed" : ""}`}>
                <div className="flex items-start gap-4">
                  <div 
                    className="text-4xl w-16 h-16 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${skill.color}20` }}
                  >
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{skill.title}</h3>
                      <span className="text-sm text-gray-500">({skill.id})</span>
                      {!skill.is_published && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Concept
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{skill.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Volgorde: {skill.order}</span>
                      <span>Moeilijkheid: {skill.difficulty}</span>
                      <span>{skill.lessons?.length || 0} lessen</span>
                    </div>
                    {skill.lessons && skill.lessons.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {skill.lessons.sort((a, b) => a.lesson_number - b.lesson_number).map((lesson) => (
                          <Link key={lesson.id} href={`/admin/lessons/${lesson.id}`}>
                            <span className={`text-xs px-2 py-1 rounded ${lesson.is_published ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"} hover:ring-2 ring-blue-300`}>
                              Les {lesson.lesson_number}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(skill)}>
                      Bewerken
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => togglePublish(skill)}>
                      {skill.is_published ? "Verbergen" : "Publiceren"}
                    </Button>
                    <Link href={`/admin/lessons/new?skillId=${skill.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        + Les
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(skill.id)}>
                      Verwijderen
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
