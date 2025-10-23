"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ConsentDialog({
  open,
  onAllow,
  onDecline,
}: {
  open: boolean;
  onAllow: () => void;
  onDecline: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Allow saving data to your browser?</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p>
            This app stores your goal and daily progress <em>locally</em> using your
            browser’s storage (IndexedDB). No servers or accounts involved.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={onDecline} variant="secondary">Don’t allow</Button>
            <Button onClick={onAllow}>Allow</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
