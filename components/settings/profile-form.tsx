// components/settings/profile-form.tsx (NEW FILE)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

interface ProfileFormProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        initials: string;
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        const result = await updateUserProfile(values);
        if (result.success) {
            toast({ title: "Success", description: "Profile updated successfully." });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
        setIsLoading(false);
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="text-lg">{user.initials}</AvatarFallback>
          </Avatar>
          <Button variant="outline" type="button">Change Avatar</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input id="name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
          <div className="space-y-2">
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" defaultValue={user?.email || ""} disabled className="bg-muted" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}