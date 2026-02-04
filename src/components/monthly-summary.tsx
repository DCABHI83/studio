"use client";

import { useState, useEffect, useMemo } from "react";
import { monthlyExpenseSummary, type MonthlyExpenseSummaryOutput } from "@/ai/flows/monthly-expense-summary";
import type { Expense } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart";

type MonthlySummaryProps = {
  expenses: Expense[];
};

export default function MonthlySummary({ expenses }: MonthlySummaryProps) {
  const [summary, setSummary] = useState<MonthlyExpenseSummaryOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });
  }, [expenses]);

  useEffect(() => {
    async function getSummary() {
      if (currentMonthExpenses.length === 0) {
        setSummary({ totalExpenses: 0, categoryBreakdown: {}, insights: "No expenses this month. You're saving a lot!" });
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await monthlyExpenseSummary({ expenses: currentMonthExpenses });
        setSummary(result);
      } catch (e) {
        console.error(e);
        setError("Could not generate summary.");
      } finally {
        setLoading(false);
      }
    }

    getSummary();
  }, [currentMonthExpenses]);

  const chartData = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.categoryBreakdown)
      .map(([category, amount]) => ({
        name: category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [summary]);

  const chartConfig = {
    amount: {
      label: "Amount",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Month's Summary</CardTitle>
        <CardDescription>
          A quick overview of your spending for the current month.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
          {loading ? (
            <Skeleton className="h-8 w-32 mt-1" />
          ) : (
            <p className="text-3xl font-bold">
              {formatCurrency(summary?.totalExpenses ?? 0)}
            </p>
          )}
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Category Breakdown</p>
            {loading ? (
                <Skeleton className="h-[200px] w-full" />
            ) : chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            tickLine={false} 
                            axisLine={false} 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            width={60}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--accent))' }}
                            content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
                        />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" />
                    </BarChart>
                </ChartContainer>
            ) : (
                <p className="text-sm text-muted-foreground">No spending to show.</p>
            )}
        </div>
      </CardContent>
       <CardFooter className="flex items-start gap-3 bg-accent/30 p-4 rounded-b-lg border-t">
        <Lightbulb className="h-5 w-5 flex-shrink-0 text-primary" />
        <div className="text-sm">
            <p className="font-semibold">AI Insights</p>
             {loading ? <Skeleton className="h-4 w-4/5 mt-1" /> : <p className="text-muted-foreground">{summary?.insights}</p>}
             {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
       </CardFooter>
    </Card>
  );
}
