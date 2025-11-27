// components/transactions/transactions-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Transaction } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.name}</TableCell>
              <TableCell>
                 <Badge variant="outline">{transaction.category}</Badge>
              </TableCell>
              <TableCell>{format(transaction.date, "PPP")}</TableCell>
              <TableCell
                className={`text-right font-medium ${
                  transaction.type === "INCOME"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}