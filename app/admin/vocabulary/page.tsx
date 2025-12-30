"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Vocabulary {
  id: string;
  frysian: string;
  dutch: string;
  part_of_speech: string | null;
  example_sentence: string | null;
  example_translation: string | null;
}

export default function AdminVocabularyPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchVocabulary();
  }, []);

  async function fetchVocabulary() {
    try {
      const res = await fetch("/api/admin/vocabulary");
      const data = await res.json();
      if (data.vocabulary) {
        setVocabulary(data.vocabulary);
      }
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredVocab = vocabulary.filter(
    (v) =>
      v.frysian.toLowerCase().includes(search.toLowerCase()) ||
      v.dutch.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/admin" className="hover:text-blue-600">Admin</Link>
          <span>/</span>
          <span>Woordenlijst</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Woordenlijst</h1>
          <span className="text-gray-600">{vocabulary.length} woorden</span>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Zoeken..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {filteredVocab.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            {vocabulary.length === 0
              ? "Nog geen woorden in de database. Importeer lessen om woorden toe te voegen."
              : "Geen woorden gevonden."}
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredVocab.map((vocab) => (
              <Card key={vocab.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">{vocab.frysian}</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-lg">{vocab.dutch}</span>
                      {vocab.part_of_speech && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {vocab.part_of_speech}
                        </span>
                      )}
                    </div>
                    {vocab.example_sentence && (
                      <p className="text-sm text-gray-600 mt-1">
                        "{vocab.example_sentence}"
                        {vocab.example_translation && (
                          <span className="text-gray-400"> — {vocab.example_translation}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
