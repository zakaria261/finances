// app/(main)/transactions/page.tsx

import { getTransactions } from "@/lib/actions/transaction.actions";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Transactions
        </h1>
        <AddTransactionDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <TransactionsTable transactions={transactions} />
          ) : (
            <p className="text-muted-foreground">No transactions found. Add one to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}