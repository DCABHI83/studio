"use client";

import { useState } from "react";
import type { Expense } from "@/lib/types";
import useLocalStorage from "@/hooks/use-local-storage";
import Header from "@/components/header";
import AddExpenseForm from "@/components/add-expense-form";
import ExpenseList from "@/components/expense-list";
import MonthlySummary from "@/components/monthly-summary";

export default function Home() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("pocketwise-expenses", []);

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    setExpenses((prevExpenses) => [
      { ...newExpense, id: crypto.randomUUID() },
      ...prevExpenses,
    ]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== id));
  };

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 items-start gap-4 md:gap-8 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <MonthlySummary expenses={expenses} />
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList expenses={sortedExpenses} onDeleteExpense={handleDeleteExpense} />
          </div>
        </div>
      </main>
    </div>
  );
}
