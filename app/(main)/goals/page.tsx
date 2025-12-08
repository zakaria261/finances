// ============================================================================
// FILE: app/(main)/goals/page.tsx
// ============================================================================

import { getGoals } from "@/lib/actions/goal.actions";
import { AddGoalDialog } from "@/components/goals/add-goal-dialog";
import { GoalCard } from "@/components/goals/goal-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <div className="flex flex-col gap-4">
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
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <CardHeader>
            <CardTitle>No Goals Yet</CardTitle>
            <CardDescription>
              Setting goals is the first step to financial freedom. Create your first goal today!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}