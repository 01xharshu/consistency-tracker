"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function RulesDialog({
  open,
  onAcknowledge,
}: {
  open: boolean;
  onAcknowledge: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm">
            <strong>If you miss a day, your progress resets to 0.</strong>
            <br />
            Keep the streak for 30 consecutive days to reach 100%.
          </p>
          <Button className="w-full" onClick={onAcknowledge}>
            I understood
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
