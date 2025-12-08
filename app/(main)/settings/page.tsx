// ============================================================================
// FILE: app/(main)/settings/page.tsx
// ============================================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
       <h1 className="text-2xl font-semibold leading-none tracking-tight">Settings</h1>
       
       <Card>
         <CardHeader>
           <CardTitle>Profile</CardTitle>
           <CardDescription>Manage your public profile information.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback className="text-lg">{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name || ""} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={user?.email || ""} disabled className="bg-muted"/>
                </div>
            </div>
            
            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
         </CardContent>
       </Card>

       <Card>
         <CardHeader>
           <CardTitle>Preferences</CardTitle>
           <CardDescription>Customize your application experience.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about new features and tips.</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Currency</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred currency for display.</p>
                </div>
                <Button variant="outline" size="sm">USD ($)</Button>
            </div>
         </CardContent>
       </Card>
    </div>
  );
}