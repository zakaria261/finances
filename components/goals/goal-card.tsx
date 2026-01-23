// components/goals/goal-card.tsx (NEW FILE)
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  createdAt: Date;
};
import { format } from "date-fns";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { addFundsToGoal } from "@/lib/actions/goal.actions";
import { useToast } from "../ui/use-toast";

const addFundsSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number."),
});

export function GoalCard({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const form = useForm<z.infer<typeof addFundsSchema>>({
    resolver: zodResolver(addFundsSchema),
    defaultValues: { amount: 0 },
  });

  const onSubmit = async (values: z.infer<typeof addFundsSchema>) => {
    const result = await addFundsToGoal({ goalId: goal.id, amount: values.amount });
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      form.reset();
      setOpen(false);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.name}</CardTitle>
        {goal.deadline && (
          <CardDescription>Deadline: {format(goal.deadline, "PPP")}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
          <Progress value={progress} />
          <p className="text-sm font-medium">{progress.toFixed(0)}% Complete</p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="secondary" className="w-full">Add Funds</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Funds to "{goal.name}"</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl><Input type="number" placeholder="100.00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Adding..." : "Add Funds"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}