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
            src: "/dashboard.png",
            alt: "Finances Expert Pro Dashboard",
            width: 1440,
            height: 900,
          }}
        />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}