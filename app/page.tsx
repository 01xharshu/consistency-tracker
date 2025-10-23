"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

import GoalDialog from "@/components/GoalDialog";
import RulesDialog from "@/components/RulesDialog";
import ConsentDialog from "@/components/ConsentDialog";
import GoalEditDialog from "@/components/GoalEditDialog";

import {
  getAllLogKeys,
  hasConsent,
  initSettings,
  isTodayDone,
  markTodayDone,
  readSettings,
  updateGoal,
  writeConsent,
} from "@/lib/storage";

import { computeStreak } from "@/lib/streak";

export default function Home() {
  const [goal, setGoal] = useState<string>("");
  const [doneKeys, setDoneKeys] = useState<Set<string>>(new Set());
  const [todayDone, setTodayDone] = useState<boolean>(false);

  const [needsGoal, setNeedsGoal] = useState<boolean>(false);
  const [needsRules, setNeedsRules] = useState<boolean>(false);
  const [needsConsent, setNeedsConsent] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const s = await readSettings();
      if (!s?.goal) {
        setNeedsGoal(true);
      } else {
        setGoal(s.goal);
        const storedRules =
          typeof window !== "undefined"
            ? localStorage.getItem("rulesSeen")
            : "1";
        if (storedRules !== "1") setNeedsRules(true);
      }

      const ok = hasConsent();
      if (!ok) setNeedsConsent(true);

      const keys = await getAllLogKeys(400);
      setDoneKeys(new Set(keys));

      setTodayDone(await isTodayDone());
    })();
  }, []);

  const { streak, pct } = useMemo(
    () => computeStreak(doneKeys, new Date(), 30),
    [doneKeys]
  );

  // Heat-map logic (if you still keep it)
  const heatMap = useMemo(() => {
    const map = new Map<string, number>();
    let consecutive = 0;
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      if (doneKeys.has(key)) {
        consecutive++;
      } else {
        consecutive = 0;
      }
      map.set(key, consecutive);
    }
    return map;
  }, [doneKeys]);

  async function handleGoalSubmit(newGoal: string) {
    await initSettings(newGoal);
    setGoal(newGoal);
    setNeedsGoal(false);
    setNeedsRules(true);
  }

  function handleRulesAck() {
    localStorage.setItem("rulesSeen", "1");
    setNeedsRules(false);
  }

  function handleConsentAllow() {
    writeConsent(true);
    setNeedsConsent(false);
    toast("Storage enabled", {
      description: "Your progress will persist on this device.",
    });
  }

  function handleConsentDecline() {
    writeConsent(false);
    setNeedsConsent(false);
    toast("Session mode only", {
      description: "Progress may be lost after closing the tab.",
    });
  }

  async function onDidIt() {
    const ok = await markTodayDone();
    if (!ok) {
      toast("Already checked in today");
      return;
    }
    setDoneKeys(new Set(await getAllLogKeys(400)));
    setTodayDone(true);
    toast("Nice!", { description: "Logged for today." });
  }

  async function onSaveGoal(newGoal: string) {
    if (!newGoal) return;
    await updateGoal(newGoal);
    setGoal(newGoal);
    setEditingGoal(false);
    toast("Goal updated");
  }

  return (
    <div className="flex-col flex items-center justify-center min-h-screen mx-auto p-6 space-y-8 max-w-3xl">
      <header className="text-center space-y-4">
        <h1 className="text-3xl lg:text-4xl font-semibold">
          Consistency Tracker
        </h1>
        <p className="text-lg text-muted-foreground">
          Goal:<br />
          <span className="font-medium text-xl">{goal || "— not set —"}</span>
        </p>
        {goal && (
          <Button size="sm" variant="secondary" onClick={() => setEditingGoal(true)}>
            Edit Goal
          </Button>
        )}
      </header>

      {/* Progress below goal */}
      <section className="w-full text-center space-y-2">
        <Progress value={pct} className="h-4 lg:h-6 w-full max-w-xl mx-auto" />
        <p className="text-sm lg:text-base">
          {Math.floor(pct)}% toward 30-day streak ({streak}/30)
        </p>
      </section>

      {/* Big 3D circular button */}
      <section className="w-full flex justify-center">
        <Button
          variant="cylinder"
          size="circle"
          disabled={todayDone}
          onClick={onDidIt}
        >
          {todayDone ? "✔" : "I did it"}
        </Button>
      </section>

      {/* Calendar */}
      <section aria-label="Calendar" className="card p-4 w-full max-w-4xl">
        <Calendar
          mode="multiple"
          selected={[...doneKeys].map((k) => new Date(k))}
          disabled={{ after: new Date() }}
          className="calendar-large"
          heatMap={heatMap}
        />
      </section>

      {/* Dialogs */}
      <GoalDialog open={needsGoal} onSubmit={handleGoalSubmit} />
      <RulesDialog open={needsRules} onAcknowledge={handleRulesAck} />
      <ConsentDialog
        open={needsConsent}
        onAllow={handleConsentAllow}
        onDecline={handleConsentDecline}
      />
      <GoalEditDialog
        open={editingGoal}
        initialGoal={goal}
        onClose={() => setEditingGoal(false)}
        onSave={onSaveGoal}
      />
    </div>
  );
}
