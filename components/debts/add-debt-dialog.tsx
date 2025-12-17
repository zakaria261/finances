// components/debts/add-debt-dialog.tsx (NEW FILE)
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createDebt } from "@/lib/actions/debt.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Debt name is required."),
  type: z.enum(["LOAN", "CREDIT_CARD", "OTHER"]),
  balance: z.coerce.number().positive("Balance must be a positive number."),
  apr: z.coerce.number().min(0, "APR cannot be negative.").max(100, "APR seems too high."),
  minPayment: z.coerce.number().positive("Minimum payment must be positive."),
});

export function AddDebtDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createDebt(values);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      form.reset();
      setOpen(false);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Debt</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Track a New Debt</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Debt Name</FormLabel>
                <FormControl><Input placeholder="e.g., Chase Sapphire Card" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Debt Type</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                      <SelectItem value="LOAN">Loan</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="balance" render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl><Input type="number" placeholder="2500.00" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
               <FormField control={form.control} name="apr" render={({ field }) => (
                <FormItem>
                  <FormLabel>APR (%)</FormLabel>
                  <FormControl><Input type="number" placeholder="21.99" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
             <FormField control={form.control} name="minPayment" render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Monthly Payment</FormLabel>
                  <FormControl><Input type="number" placeholder="75.00" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Adding..." : "Add Debt"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}