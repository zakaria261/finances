#!/bin/bash

# collect-nextjs-code.sh
# A self-contained script to collect all relevant source code from a Next.js,
# Prisma, and NextAuth project into a single context file for AI analysis.
# It automatically prepends a detailed application description.

OUTPUT_FILE="nextjs-finance-app-context.txt"

# 1. Clear or create the output file
> "$OUTPUT_FILE"

# 2. Add the comprehensive application description using a heredoc
cat << 'EOF' > "$OUTPUT_FILE"
================================================================================
APPLICATION DESCRIPTION: NEXT.JS FINANCE EXPERT PRO
================================================================================

This document contains the complete source code for "Finances Expert Pro," a full-stack personal finance management application built with the Next.js App Router.

The primary goal of the application is to provide users with a comprehensive and intelligent platform to manage every aspect of their financial lives, from daily transaction tracking to long-term investment and goal planning. The app leverages a modern tech stack to deliver a secure, performant, and feature-rich experience.

--------------------------------------------------------------------------------
CORE TECHNOLOGY STACK
--------------------------------------------------------------------------------

*   **Framework:** Next.js 14+ (with App Router)
*   **Language:** TypeScript
*   **Authentication:** NextAuth.js (with Google, Apple, and Credentials providers)
*   **Database ORM:** Prisma
*   **UI Components:** Shadcn/UI (built on Radix UI and Tailwind CSS)
*   **Styling:** Tailwind CSS
*   **Charting:** Recharts
*   **AI Integration:** Google Gemini API for financial analysis

--------------------------------------------------------------------------------
ARCHITECTURAL OVERVIEW
--------------------------------------------------------------------------------

The application follows a modern full-stack architecture facilitated by Next.js:

1.  **App Router (`src/app`):** The file system is used for routing. The structure includes:
    *   **Route Groups:** `(auth)` for login/register pages and `(main)` for the protected application dashboard to share layouts.
    *   **Server Components:** Used by default for data fetching directly from the database (via Prisma), providing excellent performance and security.
    *   **Client Components (`'use client'`):** Used for interactive UI elements like forms, charts, and navigation buttons that require state and event listeners.

2.  **API Layer (`src/app/api`):**
    *   **NextAuth Catch-all Route:** A route at `src/app/api/auth/[...nextauth]/route.ts` handles all authentication-related requests (sign-in, sign-out, callbacks).
    *   **Data API Routes:** Future API routes can be built here to serve data to the client or handle server actions.

3.  **Data Layer (Prisma):**
    *   **Schema:** The single source of truth for the database structure is defined in `prisma/schema.prisma`.
    *   **Prisma Client:** A type-safe client is used within Server Components and API routes to query the database. The client instance is managed in `src/lib/prisma.ts`.

4.  **Authentication Layer (NextAuth.js):**
    *   **Session Management:** NextAuth handles user sessions, JWTs, and database session persistence (using the Prisma adapter).
    *   **Route Protection:** Middleware (`middleware.ts`) is used to protect all routes within the `(main)` group, redirecting unauthenticated users to the login page.
    *   **Providers:** The application supports email/password (Credentials), Google, and Apple OAuth for flexible user sign-on.

--------------------------------------------------------------------------------
KEY FUNCTIONALITIES & FEATURES
--------------------------------------------------------------------------------

The application is broken down into the following core modules:

*   **Authentication:**
    *   Secure user registration and login using email/password.
    *   Seamless social login with Google and Apple.
    *   Password hashing and secure session management handled by NextAuth.

*   **Dashboard:**
    *   A central hub displaying key financial metrics: Net Worth, Monthly Cash Flow, and a Financial Health Score.
    *   Visualizations of income vs. expenses and expense category breakdowns.
    *   Quick access to recent transactions and budget alerts.

*   **Transaction Management:**
    *   Log income and expenses with details like name, amount, category, and frequency.
    *   View, sort, and filter all historical transactions.

*   **Financial Planning:**
    *   **Goals:** Create, track, and update financial goals (e.g., "Vacation Fund," "Down Payment"). Progress is visualized.
    *   **Budgets:** Set monthly spending limits for different expense categories. The dashboard shows real-time progress against these budgets.

*   **Asset & Debt Management:**
    *   **Patrimoine (Wealth):** Track the value of assets like savings accounts, real estate, and other valuables.
    *   **Investments:** A dedicated module to track stocks, crypto, and ETFs, including quantity, purchase price, and current value.
    *   **Debts:** Manage loans and credits, with tools to visualize repayment strategies (Avalanche vs. Snowball).

*   **AI-Powered Insights:**
    *   Users can trigger a financial analysis using the Gemini API.
    *   The AI provides a detailed report including a financial score, strengths, weaknesses, and actionable recommendations.

*   **Gamification & Engagement:**
    *   **Season Pass:** A tiered reward system where users earn XP by performing financial tasks (e.g., adding an expense, creating a goal).
    *   **Rewards:** Leveling up unlocks new features (e.g., advanced charts, CSV export) and cosmetic themes.

--------------------------------------------------------------------------------
DATABASE MODELS (Prisma Schema Overview)
--------------------------------------------------------------------------------

The `prisma/schema.prisma` file defines the following core models:

*   `User`: Stores user information, linked to `Account` and `Session`.
*   `Account`: Stores provider details for social logins (linked to `User`).
*   `Session`: Manages user sessions for NextAuth.
*   `VerificationToken`: Used for email verification flows.
*   `Transaction`: A central model for all income and expenses, with a type field (`INCOME` or `EXPENSE`), category, amount, etc. Linked to a `User`.
*   `Goal`: Stores user-defined financial goals. Linked to a `User`.
*   `Asset`: Represents items contributing to net worth. Linked to a `User`.
*   `Investment`: A specific type of asset for tracking market investments. Linked to a `User`.
*   `Budget`: Defines category-based spending limits. Linked to a `User`.
*   `GameState`: Stores all gamification data for a user (level, XP, claimed rewards). Linked to a `User`.

This structure ensures data is well-organized, relational, and strongly typed throughout the application.

================================================================================
PROJECT CODE FILES
================================================================================
EOF

# 3. Define helper functions

# Function to check if a file is relevant source code
is_source_code() {
    local file="$1"
    local ext="${file##*.}"
    local filename="${file##*/}"
    
    # Always include Prisma schema
    if [[ "$filename" == "schema.prisma" ]]; then
        return 0
    fi
    
    case "$ext" in
        ts|tsx|js|jsx|mjs|css|json)
            # Skip lock files
            if [[ "$filename" == "package-lock.json" ]] || [[ "$filename" == "yarn.lock" ]]; then
                return 1
            fi
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Function to check if a path should be skipped
should_skip() {
    local path="$1"
    
    # Skip common build/dependency/git directories and environment files
    if [[ "$path" == *"/node_modules/"* ]] || \
       [[ "$path" == *"/dist/"* ]] || \
       [[ "$path" == *"/.next/"* ]] || \
       [[ "$path" == *"/build/"* ]] || \
       [[ "$path" == *"/.git/"* ]] || \
       [[ "$path" == *"/coverage/"* ]] || \
       [[ "$path" == *".env"* ]]; then
        return 0
    fi
    
    return 1
}

# Function to append file content with a structured header
append_file() {
    local filepath="$1"
    
    echo "" >> "$OUTPUT_FILE"
    echo "// ============================================================================" >> "$OUTPUT_FILE"
    echo "// FILE: $filepath" >> "$OUTPUT_FILE"
    echo "// ============================================================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "$filepath" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# 4. Find and append all relevant project files

count=0
echo ""
echo "Scanning for Next.js project files..."

while IFS= read -r -d '' file; do
    relpath="${file#./}"
    
    if should_skip "$relpath"; then
        continue
    fi
    
    if is_source_code "$relpath"; then
        echo "✓ Adding: $relpath"
        append_file "$relpath"
        ((count++))
    fi
done < <(find . -type f \
    -not \( -path "*/node_modules/*" -o -path "*/.next/*" -o -path "*/dist/*" -o -path "*/build/*" -o -path "*/.git/*" -o -path "*/coverage/*" -o -name ".env*" \) \
    -print0 | sort -z)

# 5. Add a final footer
cat << EOF >> "$OUTPUT_FILE"

// ============================================================================
// END OF CONTEXT
// ============================================================================
// Total files included: $count
// Generated: $(date)
// ============================================================================
EOF

# 6. Print summary
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✓ Collection complete!"
echo "✓ Files processed: $count"
echo "✓ Output file: $OUTPUT_FILE"
echo "✓ File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo "════════════════════════════════════════════════════════════════"