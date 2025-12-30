import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

// Check if user is admin
async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return profile?.is_admin === true;
}

// POST /api/admin/import/bulk - Import all lesson files at once
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const logs: string[] = [];
  const body = await request.json();
  const { includeSkills = true, includeLessons = true } = body;

  try {
    // Import skills first if requested
    if (includeSkills) {
      logs.push("=== Importing Skills ===");
      const skillsPath = path.join(process.cwd(), "data/skills.json");

      if (fs.existsSync(skillsPath)) {
        const skillsData = JSON.parse(fs.readFileSync(skillsPath, "utf8"));

        for (const skill of skillsData.skills) {
          const { error } = await supabase.from("skills").upsert(
            {
              id: skill.id,
              title: skill.title,
              description: skill.description,
              long_description: skill.longDescription,
              icon: skill.icon || "📚",
              order: skill.order,
              difficulty: skill.difficulty || 1,
              prerequisites: skill.prerequisites || [],
              color: skill.color || "#3b82f6",
              is_published: true,
            },
            { onConflict: "id" }
          );

          if (error) {
            logs.push(`✗ Skill "${skill.title}": ${error.message}`);
          } else {
            logs.push(`✓ Skill "${skill.title}" imported`);
          }
        }
      } else {
        logs.push("✗ skills.json not found");
      }
    }

    // Import lessons if requested
    if (includeLessons) {
      logs.push("");
      logs.push("=== Importing Lessons ===");
      const lessonsDir = path.join(process.cwd(), "data/lessons");

      if (fs.existsSync(lessonsDir)) {
        const lessonFiles = fs
          .readdirSync(lessonsDir)
          .filter((f) => f.endsWith(".json"))
          .sort();

        logs.push(`Found ${lessonFiles.length} lesson files`);

        for (const file of lessonFiles) {
          const filePath = path.join(lessonsDir, file);
          const lesson = JSON.parse(fs.readFileSync(filePath, "utf8"));

          logs.push(`\n--- ${file} ---`);

          // Insert/update lesson
          const { error: lessonError } = await supabase.from("lessons").upsert(
            {
              id: lesson.id,
              skill_id: lesson.skillId,
              lesson_number: lesson.lessonNumber,
              title: lesson.title,
              description: lesson.description,
              topic: lesson.topic,
              difficulty: lesson.difficulty || 1,
              estimated_minutes: lesson.estimatedMinutes || 10,
              is_published: true,
            },
            { onConflict: "id" }
          );

          if (lessonError) {
            logs.push(`✗ Lesson: ${lessonError.message}`);
            continue;
          }
          logs.push(`✓ Lesson "${lesson.title}" created`);

          // Import vocabulary and intro cards
          if (lesson.introCards && lesson.introCards.length > 0) {
            for (let i = 0; i < lesson.introCards.length; i++) {
              const card = lesson.introCards[i];
              const vocab = card.vocabulary;

              if (vocab) {
                // Insert/update vocabulary
                const { error: vocabError } = await supabase
                  .from("vocabulary")
                  .upsert(
                    {
                      id: vocab.id,
                      frysian: vocab.frysian,
                      dutch: vocab.dutch,
                      part_of_speech: vocab.partOfSpeech,
                      example_sentence:
                        vocab.exampleSentence || card.exampleSentence,
                      example_translation:
                        vocab.exampleTranslation || card.exampleTranslation,
                    },
                    { onConflict: "id" }
                  );

                if (vocabError) {
                  logs.push(`  ✗ Vocab "${vocab.frysian}": ${vocabError.message}`);
                  continue;
                }

                // Insert/update intro card
                const { error: cardError } = await supabase
                  .from("intro_cards")
                  .upsert(
                    {
                      id: card.id,
                      lesson_id: lesson.id,
                      vocabulary_id: vocab.id,
                      order: i,
                      example_sentence: card.exampleSentence,
                      example_translation: card.exampleTranslation,
                    },
                    { onConflict: "id" }
                  );

                if (cardError) {
                  logs.push(`  ✗ IntroCard: ${cardError.message}`);
                } else {
                  logs.push(`  ✓ Vocab+Card: ${vocab.frysian}`);
                }
              }
            }
          }

          // Import exercises
          if (lesson.exercises && lesson.exercises.length > 0) {
            for (let i = 0; i < lesson.exercises.length; i++) {
              const ex = lesson.exercises[i];

              const { error: exError } = await supabase.from("exercises").upsert(
                {
                  id: ex.id,
                  lesson_id: lesson.id,
                  type: ex.type,
                  order: i,
                  data: ex,
                },
                { onConflict: "id" }
              );

              if (exError) {
                logs.push(`  ✗ Exercise "${ex.id}": ${exError.message}`);
              } else {
                logs.push(`  ✓ Exercise: ${ex.type} (${ex.id})`);
              }
            }
          }
        }
      } else {
        logs.push("✗ lessons directory not found");
      }
    }

    logs.push("");
    logs.push("=== Import Complete ===");

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    logs.push(`\n✗ Fatal error: ${error}`);
    return NextResponse.json({ success: false, logs, error: String(error) }, { status: 500 });
  }
}
