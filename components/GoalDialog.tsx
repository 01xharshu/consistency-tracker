"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onSubmit: (goal: string) => void;
};

export default function GoalDialog({ open, onSubmit }: Props) {
  const [goal, setGoal] = useState("");

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What is your goal?</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="e.g., Meditate 10 minutes"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <Button
            className="w-full"
            disabled={!goal.trim()}
            onClick={() => onSubmit(goal.trim())}
          >
            Save goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
