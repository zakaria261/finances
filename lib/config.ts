// ============================================================================
// FILE: lib/config.ts
// ============================================================================

export const siteConfig = {
  name: "Finances Expert Pro",
  description: "The Smart Way to Manage Your Personal Finances.",
  menuItems: [
    { id: "features", name: "Features", href: "#features" },
    { id: "pricing", name: "Pricing", href: "#pricing" },
    { id: "about", name: "About", href: "#about" },
  ],
  gamification: {
    xpEvents: {
      "ADD_TRANSACTION": 10,
      "ADD_GOAL": 25,
      "FUND_GOAL": 15,
      "ADD_BUDGET": 20,
      "ADD_INVESTMENT": 20,
      "ADD_ASSET": 15,
      "ADD_DEBT": 15,
      "AI_ANALYSIS": 50, // Added this one
    },
    // XP needed to complete the CURRENT level and reach the NEXT one.
    // Index 0 = Level 1 (needs 100XP to reach Lvl 2)
    // Index 1 = Level 2 (needs 150XP to reach Lvl 3)
    xpToNextLevel: [100, 150, 200, 250, 300, 400, 500, 600, 800, 1000], 
    rewards: [
      { level: 2, name: "Advanced Charts" },
      { level: 3, name: "New Theme" },
      { level: 5, name: "CSV Export" },
    ]
  }
};