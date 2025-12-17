// components/settings/preferences-form.tsx (NEW FILE)
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function PreferencesForm() {
    // This would be backed by state and server actions in a real app
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Marketing Emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about new features and tips.
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Currency</Label>
          <p className="text-sm text-muted-foreground">
            Select your preferred currency for display.
          </p>
        </div>
        <Button variant="outline" size="sm">
          USD ($)
        </Button>
      </div>
      <div className="flex justify-end">
          <Button>Save Preferences</Button>
      </div>
    </div>
  );
}