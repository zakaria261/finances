// lib/config.ts
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
    },
    // Cumulative XP to reach the next level (index 0 is for level 2)
    xpToNextLevel: [100, 150, 200, 250, 300, 400, 500],
    rewards: [
        { level: 2, name: "Advanced Charts"},
        { level: 3, name: "New Theme"},
        { level: 5, name: "CSV Export"},
    ]
  }
};