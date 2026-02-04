"use client";

import type { Expense } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { categoryIcons, categoryStyles } from "@/components/icons";

type ExpenseListProps = {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
};

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>Your recorded expenses will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
            <h3 className="text-lg font-medium text-muted-foreground">No expenses yet!</h3>
            <p className="text-sm text-muted-foreground">Start by adding a new expense.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses</CardTitle>
        <CardDescription>A list of all your recorded expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]">
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {expenses.map((expense) => (
                    <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        onDelete={onDeleteExpense}
                    />
                ))}
            </TableBody>
            </Table>
        </div>
        <div className="md:hidden">
            <div className="space-y-4">
                {expenses.map((expense) => (
                    <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        onDelete={onDeleteExpense}
                    />
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}


function ExpenseRow({ expense, onDelete }: { expense: Expense; onDelete: (id: string) => void }) {
    const CategoryIcon = categoryIcons[expense.category];
    const styles = categoryStyles[expense.category];

    return (
        <TableRow>
            <TableCell>
            <Badge
                variant="outline"
                className={cn(
                    "flex items-center gap-2 whitespace-nowrap border-transparent",
                    styles.bg,
                    styles.text
                )}
            >
                <CategoryIcon className="h-4 w-4" />
                {expense.category}
            </Badge>
            </TableCell>
            <TableCell className="max-w-[250px] truncate">{expense.note || "-"}</TableCell>
            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
            <TableCell className="text-right font-medium">
            {formatCurrency(expense.amount)}
            </TableCell>
            <TableCell>
            <DeleteExpenseDialog id={expense.id} onDelete={onDelete} />
            </TableCell>
        </TableRow>
    );
}

function ExpenseCard({ expense, onDelete }: { expense: Expense; onDelete: (id: string) => void }) {
    const CategoryIcon = categoryIcons[expense.category];
    const styles = categoryStyles[expense.category];
    return (
        <div className="flex items-start justify-between rounded-lg border p-4 shadow-sm">
            <div className="flex items-start gap-4">
                <div className={cn("mt-1 flex h-8 w-8 items-center justify-center rounded-full", styles.bg)}>
                    <CategoryIcon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                    <p className="font-semibold">{expense.category}</p>
                    <p className="text-sm text-muted-foreground">{expense.note || new Date(expense.date).toLocaleDateString()}</p>
                    {expense.note && <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>}
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                 <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                 <DeleteExpenseDialog id={expense.id} onDelete={onDelete} />
            </div>
        </div>
    )
}


function DeleteExpenseDialog({ id, onDelete }: { id: string; onDelete: (id: string) => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete expense</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            expense from your records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(id)}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
