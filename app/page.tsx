import { Header } from "@/components/layout/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero
          eyebrow="FINANCES EXPERT PRO"
          title={
            <>
              La gestion financière <br className="hidden md:block" /> intelligente et simplifiée
            </>
          }
          subtitle="Du suivi quotidien aux investissements long terme, notre plateforme boostée par l'IA vous donne la clarté nécessaire pour atteindre vos objectifs."
          ctaText="Commencer Gratuitement"
          ctaLink="/register"
          mockupImage={{
            src: "/dashboard.png", // Ensure this image exists in public folder
            alt: "Interface Finances Expert Pro",
            width: 1440,
            height: 900,
          }}
        />
        <Features />
        <Pricing />

        {/* About section - FIXED: Added mx-auto and px-4 */}
        <section id="about" className="w-full py-24 sm:py-32 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">À propos de nous</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Finances Expert Pro est né d'une mission simple : rendre l'éducation et la gestion financière accessibles à tous. 
                Nous combinons une technologie de pointe avec une expérience utilisateur intuitive pour vous aider à bâtir un patrimoine durable.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}