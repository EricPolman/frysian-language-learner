import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser, logout } from "@/app/login/actions";

export async function Header() {
  const user = await getUser();

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={user ? "/learn" : "/"} className="flex items-center gap-2">
          <div className="text-2xl">🇳🇱</div>
          <span className="text-xl font-bold text-gray-900">
            Frysian Learning
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
