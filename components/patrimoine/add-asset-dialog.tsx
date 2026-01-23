// ============================================================================
// FILE: components/patrimoine/add-asset-dialog.tsx
// ============================================================================

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createAsset } from "@/lib/actions/patrimoine.actions";

// -----------------------------------------------------------------------------
// Zod schema
// -----------------------------------------------------------------------------
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.coerce
    .number({ invalid_type_error: "Value must be a number" })
    .positive("Value must be positive"),
  type: z.enum(["SAVINGS", "REAL_ESTATE", "OTHER"]),
});

type FormValues = z.infer<typeof formSchema>;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export function AddAssetDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: 0,
      type: "SAVINGS",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await createAsset(values);

    if (result.success) {
      toast({ title: "Success", description: result.message });
      form.reset();
      setOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Asset</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Asset</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Livret A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value (€)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SAVINGS">Savings</SelectItem>
                      <SelectItem value="REAL_ESTATE">Real estate</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Adding..." : "Add Asset"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
