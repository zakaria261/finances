// components/layout/footer.tsx
import { siteConfig } from "@/lib/config";
import { Logo } from "../global/logo";

export function Footer() {
    return (
        <footer className="border-t">
            <div className="container py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                    <Logo />
                    <p className="text-center text-sm leading-loose text-muted-foreground">
                        Built with Next.js and Shadcn/UI.
                    </p>
                     <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}