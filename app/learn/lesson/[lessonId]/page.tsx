import { getUser } from "@/app/login/actions";
import { redirect, notFound } from "next/navigation";
import { LessonClient } from "@/components/lesson/LessonClient";
import { getLesson } from "@/lib/lessons";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Load lesson data from database
  const lesson = await getLesson(lessonId);
  
  if (!lesson) {
    notFound();
  }

  return <LessonClient lesson={lesson} userId={user.id} />;
}
