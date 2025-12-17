// app/(main)/settings/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { ProfileForm } from "@/components/settings/profile-form";
import { PreferencesForm } from "@/components/settings/preferences-form";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) return null;

  const userWithInitials = {
      ...user,
      initials: getInitials(user.name)
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
       <h1 className="text-2xl font-semibold leading-none tracking-tight">Settings</h1>
       
       <Card>
         <CardHeader>
           <CardTitle>Profile</CardTitle>
           <CardDescription>Manage your public profile information.</CardDescription>
         </CardHeader>
         <CardContent>
            <ProfileForm user={userWithInitials} />
         </CardContent>
       </Card>

       <Card>
         <CardHeader>
           <CardTitle>Preferences</CardTitle>
           <CardDescription>Customize your application experience.</CardDescription>
         </CardHeader>
         <CardContent>
            <PreferencesForm />
         </CardContent>
       </Card>
    </div>
  );
}