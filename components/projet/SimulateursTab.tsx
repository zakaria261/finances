// À ajouter dans SimulateursTab.tsx

import { useRouter } from 'next/navigation'

// ... dans le composant SimulateursTab

const router = useRouter()

// Fonction pour lancer l'analyse IA avec les données de simulation
const handleAnalyseIA = () => {
  // Préparer les données de simulation selon l'onglet actif
  const simulationData: any = {}

  if (activeSim === 'retraite') {
    const lastData = retraiteResultData[retraiteResultData.length - 1]
    simulationData.retraite = {
      ageActuel: retraite.ageActuel,
      ageRetraite: retraite.ageRetraite,
      capitalActuel: retraite.capitalActuel,
      epargneMensuelle: retraite.epargneMensuelle,
      rendement: retraite.rendement,
      inflation: retraite.inflation,
      projectionCapital: lastData.Nominal,
      projectionReel: lastData.Reel,
      renteMensuelle: Math.round((lastData.Nominal * 0.04) / 12)
    }
  }

  if (activeSim === 'immo') {
    simulationData.immobilier = {
      prixBien: immo.prixBien,
      apport: immo.apport,
      montantEmprunt: immoCalculs.montantEmprunt,
      dureeAnnees: immo.dureeAnnees,
      taux: immo.taux,
      mensualite: immoCalculs.mensualite,
      coutInterets: immoCalculs.coutTotalInterets,
      revenusMensuels: immo.revenusMensuels,
      tauxEndettement: immoCalculs.tauxEndettement
    }
  }

  if (activeSim === 'projet') {
    const resteAFinancer = Math.max(0, projet.montant - projet.epargneActuelle)
    simulationData.projet = {
      nom: projet.nom,
      montant: projet.montant,
      delaiMois: projet.delaiMois,
      epargneActuelle: projet.epargneActuelle,
      resteAFinancer,
      profil: projet.profil,
      mensualiteBrute: projetCalculs.mensualiteBrute,
      mensualiteOptimisee: projetCalculs.mensualiteOptimisee,
      gainInterets: projetCalculs.gainInterets
    }
  }

  // Stocker les données dans sessionStorage pour les récupérer dans la page d'analyse
  sessionStorage.setItem('simulationData', JSON.stringify(simulationData))
  
  // Rediriger vers l'analyse IA avec paramètre spécial
  router.push('/analyse-ia?autostart=true&source=simulation')
}

// BOUTON À AJOUTER dans la section "Action Finale" (après le bouton "Convertir en Objectif")

return (
  <div className="space-y-8 animate-fadeIn pb-12">
    {/* ... tout le code existant ... */}

    {/* Action Finale */}
    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
      {activeSim === 'projet' && (
        <Button 
          onClick={handleCreerObjectif}
          className="h-16 px-12 text-lg rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] transition-transform shadow-xl shadow-purple-500/20"
        >
          <Target className="w-6 h-6 mr-3"/> Convertir en Objectif de Vie
        </Button>
      )}
      
      {/* NOUVEAU BOUTON IA */}
      <Button 
        onClick={handleAnalyseIA}
        className="h-16 px-12 text-lg rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:scale-[1.02] transition-transform shadow-xl shadow-pink-500/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="w-6 h-6 mr-3 relative z-10 animate-pulse"/> 
        <span className="relative z-10">Analyser avec l'IA</span>
      </Button>
    </div>

    {/* Message informatif sous les boutons */}
    <div className={cn(
      "text-center text-sm p-4 rounded-xl border",
      currentTheme.isDark ? "bg-purple-900/20 border-purple-500/30" : "bg-purple-50 border-purple-100"
    )}>
      <Brain className="w-5 h-5 inline-block mr-2 text-purple-500" />
      <span className="text-purple-700 dark:text-purple-300">
        L'IA analysera vos projections et vous proposera des optimisations personnalisées (+50 XP)
      </span>
    </div>
  </div>
)