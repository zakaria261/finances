// ============================================================================
// FILE: components/investments/investments-table.tsx
// ============================================================================

"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { deleteInvestment } from "@/lib/actions/investment.actions";
import { useToast } from "@/components/ui/use-toast";
import type { Investment } from "@prisma/client";

export function InvestmentsTable({ investments }: { investments: Investment[] }) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this investment?")) {
      const result = await deleteInvestment(id);
      if (result.success) {
        toast({ title: "Deleted", description: "Investment removed successfully." });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Buy Price</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium">{inv.ticker}</TableCell>
              <TableCell>{inv.name}</TableCell>
              <TableCell className="text-right">{inv.quantity}</TableCell>
              <TableCell className="text-right">{formatCurrency(inv.purchasePrice)}</TableCell>
              <TableCell className="text-right font-bold text-green-600">
                {formatCurrency(inv.quantity * inv.purchasePrice)} {/* Mocking current value logic */}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}