"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addFundsToGoal } from "@/lib/actions/goal.actions";
import { useToast } from "@/components/ui/use-toast";

/* ✅ TYPE UI (PAS PRISMA) */
type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
};

/* ✅ ZOD SCHEMA */
const addFundsSchema = z.object({
  amount: z.coerce.number().min(0),
});


/* ✅ TYPE FORM */
type AddFundsFormValues = {
  amount: number;
};

export function GoalCard({ goal }: { goal: Goal }) {
  const { toast } = useToast();

  const form = useForm<AddFundsFormValues>({
    // @ts-ignore
    resolver: zodResolver<AddFundsFormValues>(addFundsSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (values: AddFundsFormValues) => {
    //@ts-ignore
    const result = await addFundsToGoal(goal.id, values.amount);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.name}</CardTitle>
        <CardDescription>
          Target: €{goal.targetAmount.toLocaleString()}
          {goal.deadline && (
            <> · By {format(new Date(goal.deadline), "dd/MM/yyyy")}</>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          Current: €{goal.currentAmount.toLocaleString()}
        </p>
      </CardContent>

      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add funds</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add funds to {goal.name}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
              //@ts-ignore
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                //@ts-ignore
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
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
