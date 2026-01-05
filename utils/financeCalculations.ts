import type { Depense, Revenu } from '@/types';

export function formaterMontant(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant);
}

export function calculerMontantMensuel(item: Depense | Revenu): number {
  const montant = typeof item.montant === 'string' ? parseFloat(item.montant) : item.montant;
  if (isNaN(montant)) return 0;
  
  switch (item.frequence) {
    case 'quotidien':
      return montant * 30;
    case 'hebdomadaire':
      return montant * 4.33;
    case 'mensuel':
      return montant;
    case 'trimestriel':
      return montant / 3;
    case 'semestriel':
      return montant / 6;
    case 'annuel':
      return montant / 12;
    default:
      return montant;
  }
}