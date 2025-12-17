// ============================================================================
// FILE: app/(main)/goals/page.tsx
// ============================================================================
import { GoalCard } from "@/components/goals/goal-card";
import { Empty } from "@/components/ui/empty";
import { Target } from "lucide-react";

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Financial Goals
        </h1>
        <AddGoalDialog />
      </div>

      {goals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <Empty>
            <Target className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
                <h3 className="text-lg font-semibold">No Goals Yet</h3>
                <p className="text-muted-foreground text-sm mt-1">Setting goals is the first step to financial freedom.</p>
            </div>
        </Empty>
      )}
    </div>
  );
}