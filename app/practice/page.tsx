import { getUser } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { PracticeClient } from "@/components/lesson/PracticeClient";

export const metadata = {
  title: "Oefenen - Frysk Leare",
  description: "Oefen je zwakke woorden",
};

export default async function PracticePage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  return <PracticeClient userId={user.id} />;
}
