import { 
  BarChart3, 
  Wallet, 
  Target, 
  Bot, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

const featureList = [
    { 
        icon: Wallet, 
        title: "Gestion de Transactions", 
        description: "Enregistrez vos revenus et dépenses en un clin d'œil. Catégorisez intelligemment pour mieux comprendre vos habitudes." 
    },
    { 
        icon: BarChart3, 
        title: "Planification Financière", 
        description: "Définissez des budgets par catégorie et suivez votre progression en temps réel pour ne jamais dépasser vos limites." 
    },
    { 
        icon: Target, 
        title: "Objectifs & Gamification", 
        description: "Transformez l'épargne en jeu. Gagnez de l'XP en atteignant vos objectifs et débloquez des fonctionnalités exclusives." 
    },
    { 
        icon: Bot, 
        title: "Analyses IA Avancées", 
        description: "Recevez des conseils personnalisés et des prévisions de trésorerie générés par notre intelligence artificielle." 
    },
    { 
        icon: ShieldCheck, 
        title: "Sécurité Maximale", 
        description: "Vos données sont chiffrées et protégées. Nous utilisons les standards bancaires pour garantir votre confidentialité." 
    },
    { 
        icon: Zap, 
        title: "Synchronisation Rapide", 
        description: "Une interface fluide et réactive qui fonctionne parfaitement sur tous vos appareils, où que vous soyez." 
    },
]

export function Features() {
  return (
    <section id="features" className="w-full py-24 sm:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        {/* FIXED: Added mx-auto and px-4/6 to center the container */}
        <div className="container mx-auto relative z-10 px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Tout ce dont vous avez besoin pour réussir
                </h2>
                <p className="text-lg text-muted-foreground">
                    Une suite complète d'outils puissants pour prendre le contrôle total de votre avenir financier.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featureList.map((feature, i) => (
                     <div 
                        key={feature.title} 
                        className="group relative p-8 rounded-2xl border bg-card hover:bg-accent/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
                     >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <feature.icon className="w-24 h-24 text-primary" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                               <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                     </div>
                ))}
            </div>
        </div>
    </section>
  );
}