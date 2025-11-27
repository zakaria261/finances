// app/(auth)/layout.tsx
import Image from "next/image";
import Link from "next/link";
import { Wallet } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            {children}
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/auth-background.jpg" // Add a suitable image to your /public folder
          alt="Financial planning background"
          fill
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-12">
            <Link href="/" className="flex items-center space-x-2 mb-4">
                <Wallet className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">Finances Expert Pro</span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-white">
                Take control of your financial future.
            </h2>
            <p className="mt-4 text-lg text-white/80">
                Join thousands of users who are building wealth and achieving their goals with our powerful tools.
            </p>
        </div>
      </div>
    </div>
  );
}