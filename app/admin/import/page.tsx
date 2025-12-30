"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ImportPage() {
  const [importing, setImporting] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [jsonInput, setJsonInput] = useState("");

  async function bulkImportAll() {
    if (!confirm("Dit zal alle skills en lessen importeren uit de data/ map. Wil je doorgaan?")) {
      return;
    }

    setBulkImporting(true);
    setResults(["Starting bulk import..."]);

    try {
      const res = await fetch("/api/admin/import/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includeSkills: true, includeLessons: true }),
      });

      const data = await res.json();
      
      if (data.logs) {
        setResults(data.logs);
      } else if (data.error) {
        setResults([`Error: ${data.error}`]);
      }
    } catch (error) {
      setResults([`Error: ${error}`]);
    } finally {
      setBulkImporting(false);
    }
  }

  async function importFromJson() {
    if (!jsonInput.trim()) {
      alert("Plak eerst JSON data");
      return;
    }

    setImporting(true);
    setResults([]);

    try {
      const data = JSON.parse(jsonInput);
      const logs: string[] = [];

      // Check if it's a skill or lesson
      if (data.skills) {
        for (const skill of data.skills) {
          logs.push(`Importing skill: ${skill.title}...`);
          
          const res = await fetch("/api/admin/skills", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: skill.id,
              title: skill.title,
              description: skill.description,
              longDescription: skill.longDescription,
              icon: skill.icon || "📚",
              order: skill.order,
              difficulty: skill.difficulty || 1,
              prerequisites: skill.prerequisites || [],
              color: skill.color || "#3b82f6",
              isPublished: true,
            }),
          });

          if (res.ok) {
            logs.push(`✓ Skill "${skill.title}" imported`);
          } else {
            const error = await res.json();
            logs.push(`✗ Failed: ${error.error}`);
          }
        }
      } else if (data.id && data.exercises) {
        // Import a single lesson
        await importLesson(data, logs);
      } else {
        logs.push("Unknown JSON format. Expected skills.json or lesson JSON.");
      }

      setResults(logs);
    } catch (error) {
      setResults([`Error parsing JSON: ${error}`]);
    } finally {
      setImporting(false);
    }
  }

  async function importLesson(lesson: any, logs: string[]) {
    logs.push(`Importing lesson: ${lesson.title}...`);

    // Create the lesson
    const lessonRes = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lesson.id,
        skillId: lesson.skillId,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        description: lesson.description,
        topic: lesson.topic,
        difficulty: lesson.difficulty || 1,
        estimatedMinutes: lesson.estimatedMinutes || 10,
        isPublished: true,
      }),
    });

    if (!lessonRes.ok) {
      const error = await lessonRes.json();
      logs.push(`✗ Failed to create lesson: ${error.error}`);
      return;
    }

    logs.push(`✓ Lesson created`);

    // Import intro cards
    if (lesson.introCards && lesson.introCards.length > 0) {
      logs.push(`Importing ${lesson.introCards.length} intro cards...`);

      for (const card of lesson.introCards) {
        const cardRes = await fetch(`/api/admin/lessons/${lesson.id}/intro-cards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: card.id,
            vocabulary: {
              id: card.vocabulary?.id || `vocab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              frysian: card.vocabulary?.frysian,
              dutch: card.vocabulary?.dutch,
              partOfSpeech: card.vocabulary?.partOfSpeech,
              exampleSentence: card.vocabulary?.exampleSentence || card.exampleSentence,
              exampleTranslation: card.vocabulary?.exampleTranslation || card.exampleTranslation,
            },
            exampleSentence: card.exampleSentence,
            exampleTranslation: card.exampleTranslation,
          }),
        });

        if (cardRes.ok) {
          logs.push(`  ✓ Intro card: ${card.vocabulary?.frysian}`);
        } else {
          const error = await cardRes.json();
          logs.push(`  ✗ Intro card failed: ${error.error}`);
        }
      }
    }

    // Import exercises
    if (lesson.exercises && lesson.exercises.length > 0) {
      logs.push(`Importing ${lesson.exercises.length} exercises...`);

      for (const ex of lesson.exercises) {
        const exRes = await fetch(`/api/admin/lessons/${lesson.id}/exercises`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ex),
        });

        if (exRes.ok) {
          logs.push(`  ✓ Exercise: ${ex.type}`);
        } else {
          const error = await exRes.json();
          logs.push(`  ✗ Exercise failed: ${error.error}`);
        }
      }
    }

    logs.push(`✓ Lesson "${lesson.title}" import complete`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/admin" className="hover:text-blue-600">Admin</Link>
          <span>/</span>
          <span>Importeren</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">JSON Importeren</h1>

        {/* Bulk Import Section */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h2 className="font-bold mb-2 text-blue-900">🚀 Bulk Import</h2>
          <p className="text-sm text-blue-700 mb-4">
            Importeer alle skills en lessen uit de <code className="bg-blue-100 px-1 rounded">data/</code> map in één keer.
            Dit zal bestaande records bijwerken (upsert) in plaats van dupliceren.
          </p>
          <Button
            onClick={bulkImportAll}
            disabled={bulkImporting || importing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {bulkImporting ? "Bezig met bulk import..." : "Alles Importeren (Skills + Lessen)"}
          </Button>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="font-bold mb-4">Plak JSON Data</h2>
          <p className="text-sm text-gray-600 mb-4">
            Je kunt skills.json of individuele lesson JSON-bestanden importeren.
          </p>
          <textarea
            className="w-full h-64 px-3 py-2 border rounded-md font-mono text-sm"
            placeholder='Plak hier je JSON data...

Voorbeelden:
- skills.json: { "skills": [...] }
- lesson.json: { "id": "basics-1-1", "exercises": [...] }'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <Button
            className="mt-4"
            onClick={importFromJson}
            disabled={importing || !jsonInput.trim()}
          >
            {importing ? "Bezig met importeren..." : "Importeren"}
          </Button>
        </Card>

        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="font-bold mb-4">Resultaten</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {results.map((line, i) => (
                <div key={i} className={line.startsWith("✓") ? "text-green-400" : line.startsWith("✗") ? "text-red-400" : ""}>
                  {line}
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="mt-8">
          <h2 className="font-bold mb-4">💡 Tips</h2>
          <div className="text-gray-600 text-sm space-y-4">
            <div>
              <strong>Bulk Import (aanbevolen):</strong>
              <p className="mt-1">
                Gebruik de "Alles Importeren" knop hierboven om alle skills en lessen in één keer te importeren.
                Dit leest alle JSON bestanden uit de <code className="bg-gray-100 px-1 rounded">data/</code> map.
              </p>
            </div>
            <div>
              <strong>Handmatige Import:</strong>
              <p className="mt-1">
                Je kunt ook individuele JSON bestanden importeren door ze te plakken in het tekstveld.
              </p>
            </div>
            <div>
              <strong>Upsert Gedrag:</strong>
              <p className="mt-1">
                De import gebruikt upsert, wat betekent dat bestaande records worden bijgewerkt en nieuwe records worden aangemaakt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
