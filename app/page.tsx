// app/page.tsx
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-14">
        <Hero
          eyebrow="FINANCES EXPERT PRO"
          title={
            <>
              The Smart Way to Manage <br /> Your Personal Finances
            </>
          }
          subtitle="From daily transaction tracking to long-term investment planning, our AI-powered platform gives you the clarity and control you need to achieve your financial goals."
          ctaText="Get Started for Free"
          ctaLink="/register"
          mockupImage={{
            src: "/dashboard-mockup.png", // NOTE: Add a placeholder image to your `public` folder
            alt: "Finances Expert Pro Dashboard Mockup",
            width: 1440,
            height: 900,
          }}
        />
        <Features />
        <Pricing />

        {/* About section */}
        <section id="about" className="w-full py-24 sm:py-32">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold">About Finances Expert Pro</h2>
              <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
                This application provides users with a comprehensive and
                intelligent platform to manage every aspect of their financial
                lives, from daily transaction tracking to long-term investment
                and goal planning.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}