import { getUser } from "@/app/login/actions";
import { redirect, notFound } from "next/navigation";
import { LessonClient } from "@/components/lesson/LessonClient";
import type { Lesson } from "@/types/content";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Load lesson data
  let lesson: Lesson;
  try {
    const lessonData = await import(
      `@/data/lessons/${lessonId}.json`
    );
    lesson = lessonData.default;
  } catch (error) {
    notFound();
  }

  return <LessonClient lesson={lesson} userId={user.id} />;
}
