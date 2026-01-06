// types/analyse.ts

export interface Recommandation {
  priorite: number;
  titre: string;
  description: string;
  economie: string;
  delai: string;
}

export interface AnalyseIA {
  score: number;
  resume: string;
  pointsForts: string[];
  pointsFaibles: string[];
  recommandationsPrioritaires: Recommandation[];
  conseilsExpert: string[];
  optimisationFiscale: string;
  dateAnalyse?: Date;
}

// Exemple de données pour tester
export const mockAnalyseIA: AnalyseIA = {
  score: 72,
  resume: "Votre situation financière est globalement saine avec des opportunités d'amélioration significatives.",
  pointsForts: [
    "Épargne régulière et constante chaque mois",
    "Diversification correcte de vos investissements",
    "Absence de dettes à taux élevé",
    "Fonds d'urgence constitué pour 6 mois de dépenses"
  ],
  pointsFaibles: [
    "Dépenses de loisirs supérieures de 30% à la moyenne recommandée",
    "Optimisation fiscale non exploitée (PER, défiscalisation)",
    "Taux d'épargne inférieur à l'objectif de 20%",
    "Frais bancaires élevés (3 comptes non nécessaires)"
  ],
  recommandationsPrioritaires: [
    {
      priorite: 1,
      titre: "Réduire les frais bancaires",
      description: "Consolidez vos comptes bancaires et optez pour une banque en ligne. Vous payez actuellement 15€/mois en frais inutiles.",
      economie: "180€/an",
      delai: "Immédiat"
    },
    {
      priorite: 2,
      titre: "Ouvrir un PER (Plan Épargne Retraite)",
      description: "Profitez de la déduction fiscale jusqu'à 10% de vos revenus. Avec votre TMI à 30%, c'est 900€ d'économies d'impôts potentielles.",
      economie: "900€/an",
      delai: "1 mois"
    },
    {
      priorite: 3,
      titre: "Optimiser le budget loisirs",
      description: "Réduisez de 20% vos dépenses de loisirs (actuellement 450€/mois) en privilégiant les activités gratuites ou à prix réduit.",
      economie: "1,080€/an",
      delai: "3 mois"
    }
  ],
  conseilsExpert: [
    "Automatisez vos virements d'épargne le jour de la réception du salaire",
    "Négociez vos contrats d'assurance auto et habitation (économie moyenne: 200€/an)",
    "Constituez un portefeuille d'ETF diversifié pour votre épargne long terme",
    "Utilisez la règle 50/30/20: 50% besoins, 30% envies, 20% épargne",
    "Revoyez vos abonnements mensuels et résiliez ceux non utilisés"
  ],
  optimisationFiscale: "Avec votre profil, vous pouvez optimiser jusqu'à 1,500€ d'impôts par an via: PER (900€), dons aux associations (300€), investissement FCPI/FIP (200€), et services à la personne (100€). Total économies potentielles: 1,500€/an soit 125€/mois."
};