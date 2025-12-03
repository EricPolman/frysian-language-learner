"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ResetProgressButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/progress/reset", {
        method: "POST",
      });

      if (response.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert("Er is iets misgegaan. Probeer het opnieuw.");
      }
    } catch (error) {
      alert("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
          🗑️ Reset Voortgang
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voortgang Resetten</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Weet je zeker dat je al je voortgang wilt resetten? Dit verwijdert:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Alle voltooide lessen</li>
              <li>Je level en XP</li>
              <li>Woordvoortgang en sterkte</li>
              <li>Alle lesstatistieken</li>
            </ul>
            <p className="font-semibold text-red-600 mt-3">
              ⚠️ Deze actie kan niet ongedaan worden gemaakt!
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Annuleren
          </Button>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={isLoading}
          >
            {isLoading ? "Bezig..." : "Ja, reset alles"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
