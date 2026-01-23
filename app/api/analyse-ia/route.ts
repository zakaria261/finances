import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Response schema for structured output
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    score: {
      type: SchemaType.NUMBER,
      description: "Score de santé financière entre 0 et 100"
    },
    resume: {
      type: SchemaType.STRING,
      description: "Résumé de la situation en 2-3 phrases"
    },
    pointsForts: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Liste de 3-4 points forts"
    },
    pointsFaibles: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Liste de 3-4 points faibles"
    },
    recommandationsPrioritaires: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          priorite: { type: SchemaType.NUMBER },
          titre: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          economie: { type: SchemaType.STRING },
          delai: { type: SchemaType.STRING }
        },
        required: ["priorite", "titre", "description", "economie", "delai"]
      }
    },
    conseilsExpert: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "5-6 conseils pratiques"
    },
    optimisationFiscale: {
      type: SchemaType.STRING,
      description: "Conseils fiscaux spécifiques à la France"
    },
    analyseSimulations: {
      type: SchemaType.OBJECT,
      properties: {
        retraite: { type: SchemaType.STRING },
        immobilier: { type: SchemaType.STRING },
        projet: { type: SchemaType.STRING }
      },
      description: "Analyses spécifiques des simulations si fournies"
    }
  },
  required: ["score", "resume", "pointsForts", "pointsFaibles", "recommandationsPrioritaires", "conseilsExpert", "optimisationFiscale"]
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Vérifier que les données sont présentes
    if (!data.revenus || !data.depenses) {
      return NextResponse.json(
        { error: 'Données financières manquantes' },
        { status: 400 }
      )
    }

    // Construire le prompt système
    const systemPrompt = `Tu es un expert financier certifié spécialisé dans la gestion de patrimoine en France. 
Tu dois analyser la situation financière d'un utilisateur et fournir des recommandations personnalisées.

Contexte fiscal français:
- TMI (Taux Marginal d'Imposition): 0%, 11%, 30%, 41%, 45%
- Dispositifs d'épargne: Livret A (3%), LDDS, LEP (6% si éligible), PEL
- Investissements défiscalisés: PER (déduction jusqu'à 10% revenus), PEA (exonération après 5 ans), Assurance Vie
- Règle du 50/30/20: 50% besoins, 30% envies, 20% épargne
- Taux d'endettement maximal: 35% (HCSF)
- Règle des 4% pour la retraite: Retrait annuel sécurisé de 4% du capital

Ton analyse doit:
1. Calculer un score de santé financière (0-100) basé sur:
   - Ratio dépenses/revenus (< 70% = bon)
   - Cash flow positif
   - Diversification des revenus et actifs
   - Présence d'un fonds d'urgence (3-6 mois de dépenses)
   - Projections futures cohérentes

2. Identifier les forces et faiblesses

3. Proposer 3-5 recommandations CONCRÈTES et CHIFFRÉES par priorité:
   - Réduction de dépenses inutiles (abonnements, frais bancaires)
   - Remboursement anticipé de dettes (méthode Avalanche: taux le plus élevé d'abord)
   - Optimisation de l'épargne et des investissements
   - Conseils fiscaux adaptés (PER, PEA, dons, etc.)
   - Arbitrages entre projets selon urgence et rentabilité

4. Donner 5-6 conseils d'expert pratiques et actionnables

5. Proposer une stratégie d'optimisation fiscale chiffrée`

    // Construire le prompt utilisateur avec les données
    let userPrompt = `Analyse la situation financière suivante:

REVENUS MENSUELS: ${data.revenus.total}€
Sources: ${JSON.stringify(data.revenus.sources, null, 2)}

DÉPENSES MENSUELLES: ${data.depenses.total}€
Détail: ${JSON.stringify(data.depenses.detail, null, 2)}

PATRIMOINE NET: ${data.patrimoine.net}€
Actifs: ${JSON.stringify(data.patrimoine.actifs, null, 2)}
Passifs: ${JSON.stringify(data.patrimoine.passifs, null, 2)}

CASH FLOW: ${data.cashFlow}€/mois

MÉTRIQUES:
- Ratio Dépenses/Revenus: ${data.metriques.ratioDepensesRevenus.toFixed(1)}%
- Taux d'Épargne: ${data.metriques.tauxEpargne.toFixed(1)}%`

    // Ajouter les simulations si présentes
    if (data.simulations) {
      userPrompt += `

SIMULATIONS ET PROJECTIONS:

`
      if (data.simulations.retraite) {
        const r = data.simulations.retraite
        userPrompt += `RETRAITE:
- Âge actuel: ${r.ageActuel} ans
- Âge de départ: ${r.ageRetraite} ans
- Capital actuel: ${r.capitalActuel}€
- Épargne mensuelle: ${r.epargneMensuelle}€
- Rendement espéré: ${r.rendement}%
- Inflation anticipée: ${r.inflation}%
- Projection capital à la retraite: ${r.projectionCapital}€ (nominal)
- Projection pouvoir d'achat réel: ${r.projectionReel}€
- Rente mensuelle estimée (4%): ${r.renteMensuelle}€

`
      }

      if (data.simulations.immobilier) {
        const i = data.simulations.immobilier
        userPrompt += `PROJET IMMOBILIER:
- Prix du bien: ${i.prixBien}€
- Apport: ${i.apport}€
- Montant emprunté: ${i.montantEmprunt}€
- Durée: ${i.dureeAnnees} ans
- Taux: ${i.taux}%
- Mensualité: ${i.mensualite}€
- Coût total intérêts: ${i.coutInterets}€
- Revenus mensuels: ${i.revenusMensuels}€
- Taux d'endettement: ${i.tauxEndettement}%
- ALERTE: ${i.tauxEndettement > 35 ? '⚠️ Dépassement du seuil de 35%' : 'Taux acceptable'}

`
      }

      if (data.simulations.projet) {
        const p = data.simulations.projet
        userPrompt += `PROJET DE VIE: ${p.nom}
- Montant cible: ${p.montant}€
- Délai: ${p.delaiMois} mois
- Épargne actuelle: ${p.epargneActuelle}€
- Reste à financer: ${p.resteAFinancer}€
- Profil de risque: ${p.profil}
- Épargne mensuelle nécessaire (sans intérêts): ${p.mensualiteBrute}€
- Épargne mensuelle optimisée (avec placement): ${p.mensualiteOptimisee}€
- Gain via placement: ${p.gainInterets}€

`
      }

      userPrompt += `ANALYSE DEMANDÉE:
1. Évalue la cohérence globale des projets par rapport aux capacités financières
2. Identifie les arbitrages nécessaires entre court, moyen et long terme
3. Signale les risques (endettement excessif, épargne insuffisante, projections irréalistes)
4. Propose des optimisations concrètes pour chaque simulation
5. Fournis des recommandations pour équilibrer tous les objectifs

`
    }

    userPrompt += `
Fournis une analyse complète et des recommandations actionnables selon le schéma JSON requis.`

    // Appeler Gemini avec structured output
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    })

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userPrompt }
    ])

    console.log('Gemini response:', result)

    const response = result.response
    const text = response.text()
    
    // Parser la réponse JSON
    const analyse = JSON.parse(text)

    // Ajouter la date d'analyse
    analyse.dateAnalyse = new Date().toISOString()

    return NextResponse.json(analyse)

  } catch (error) {
    console.error('Erreur analyse IA:', error)
    
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'analyse',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}