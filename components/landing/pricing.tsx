import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const features = [
    "Gestion illimitée des transactions",
    "Tableaux de bord analytiques",
    "Objectifs d'épargne illimités",
    "Analyse IA de base (Gemini)",
    "Support communautaire",
    "Accès mobile et desktop",
];

export function Pricing() {
  return (
    <section id="pricing" className="w-full py-24 sm:py-32 bg-secondary/20 border-y border-border/50">
        {/* FIXED: Added mx-auto and px-4/6 */}
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
                
                <div className="flex-1 max-w-xl text-center lg:text-left">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                        Une tarification simple et transparente
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Commencez gratuitement dès aujourd'hui. Pas de frais cachés, pas de carte de crédit requise pour démarrer. Débloquez des fonctionnalités avancées avec le Pass Elite via la gamification.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
                        <Button asChild size="lg" className="rounded-full px-8">
                            <Link href="/register">Commencer Gratuitement</Link>
                        </Button>
                    </div>
                </div>

                <div className="w-full max-w-sm relative">
                    {/* Glow effect behind card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                    
                    <div className="relative bg-card rounded-2xl border shadow-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Plan Standard</h3>
                            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold dark:bg-indigo-900/50 dark:text-indigo-300">
                                POPULAIRE
                            </span>
                        </div>
                        
                        <div className="mb-6">
                            <span className="text-5xl font-extrabold">0€</span>
                            <span className="text-muted-foreground ml-2">/ mois</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-8">
                            Tout ce qu'il faut pour gérer vos finances personnelles comme un pro.
                        </p>

                        <ul className="space-y-4 mb-8">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm">
                                    <div className="mt-0.5 p-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100" size="lg">
                            <Link href="/register">Créer un compte</Link>
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Aucune carte bancaire requise.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}