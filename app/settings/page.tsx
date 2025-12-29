import { getUser } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata = {
  title: "Ynstellingen - Frysk Leare",
  description: "Manage your learning preferences",
};

export default async function SettingsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  return <SettingsClient userId={user.id} />;
}
