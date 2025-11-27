// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import axios from "axios";
import { Wallet, UserPlus, Mail, Lock } from "lucide-react";
import { FaGoogle } from "react-icons/fa"; // MODIFICATION: Import the icon

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post("/api/register", values);
      
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to sign in after registration. Please log in manually.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err: any) {
        if (err.response?.status === 409) {
            setError("An account with this email already exists.");
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };


  return (
    <div>
       <div>
        <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h2 className="mt-2 text-2xl font-bold leading-9 tracking-tight text-foreground">
                Create your account
            </h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-10">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          {/* MODIFICATION: Replaced Image with React Icon */}
          <FaGoogle className="mr-2 h-4 w-4" />
          Sign up with Google
        </Button>

        <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                      <Input placeholder="John Doe" {...field} className="pl-10"/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                      <Input placeholder="you@example.com" {...field} className="pl-10"/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                       <Input type="password" placeholder="••••••••" {...field} className="pl-10"/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? "Creating account..." : <> <UserPlus className="mr-2 h-4 w-4"/> Sign up</>}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}