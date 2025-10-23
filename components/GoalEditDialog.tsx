"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  initialGoal: string;
  onClose: () => void;
  onSave: (goal: string) => void;
};

export default function GoalEditDialog({ open, initialGoal, onClose, onSave }: Props) {
  const [goal, setGoal] = useState(initialGoal);

  useEffect(() => {
    setGoal(initialGoal);
  }, [initialGoal]);

  const handleSave = () => {
    const trimmed = goal.trim();
    if (!trimmed) return;
    onSave(trimmed);
    // Optionally call onClose() here if parent doesn't auto-close:
    // onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!goal.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
